import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

interface BackupOptions {
  includeData?: boolean;
  includeSchema?: boolean;
  format?: 'sql' | 'excel';
  tables?: string[];
}

export class DatabaseBackup {
  private backupPath: string;
  private databaseUrl: string;

  constructor() {
    this.backupPath = process.env.BACKUP_PATH || './backups';
    this.databaseUrl = process.env.DATABASE_URL || '';
    
    // Ensure backup directory exists
    if (!fs.existsSync(this.backupPath)) {
      fs.mkdirSync(this.backupPath, { recursive: true });
    }
  }

  /**
   * Create a full database backup
   */
  async createBackup(options: BackupOptions = {}): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `backup_${timestamp}`;
      const backupFilePath = path.join(this.backupPath, backupFileName);

      if (options.format === 'excel') {
        return await this.exportToExcel(backupFilePath, options);
      } else {
        return await this.createSQLBackup(backupFilePath, options);
      }
    } catch (error) {
      console.error('Backup failed:', error);
      throw new Error(`Backup failed: ${error}`);
    }
  }

  /**
   * Create SQL backup using pg_dump
   */
  private async createSQLBackup(backupFilePath: string, options: BackupOptions): Promise<string> {
    const { includeData = true, includeSchema = true } = options;
    
    let pgDumpArgs = '';

    if (!includeSchema) {
      pgDumpArgs += ' --data-only';
    } else if (!includeData) {
      pgDumpArgs += ' --schema-only';
    }

    // Extract database connection details from DATABASE_URL
    const dbUrl = new URL(this.databaseUrl);
    const host = dbUrl.hostname;
    const port = dbUrl.port || '5432';
    const database = dbUrl.pathname.slice(1);
    const username = dbUrl.username;
    const password = dbUrl.password;

    const env = {
      ...process.env,
      PGPASSWORD: password,
    };

    const command = `pg_dump -h ${host} -p ${port} -U ${username} -d ${database}${pgDumpArgs} -f "${backupFilePath}.sql"`;

    try {
      await execAsync(command, { env });
      
      // Compress the backup file
      await execAsync(`gzip "${backupFilePath}.sql"`);
      
      const compressedPath = `${backupFilePath}.sql.gz`;
      
      // Clean up old backups
      await this.cleanupOldBackups();
      
      console.log(`✅ SQL backup created successfully: ${compressedPath}`);
      return compressedPath;
    } catch (error) {
      console.error('SQL backup failed:', error);
      throw new Error(`SQL backup failed: ${error}`);
    }
  }

  /**
   * Export database to Excel format
   */
  private async exportToExcel(backupFilePath: string, options: BackupOptions): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const { tables = [] } = options;

    try {
      // Get all table names if none specified
      let tablesToExport = tables;
      if (tables.length === 0) {
        tablesToExport = await this.getAllTableNames();
      }

      // Export each table to a separate worksheet
      for (const tableName of tablesToExport) {
        await this.exportTableToWorksheet(workbook, tableName);
      }

      // Add summary worksheet
      await this.addSummaryWorksheet(workbook);

      const excelPath = `${backupFilePath}.xlsx`;
      await workbook.xlsx.writeFile(excelPath);

      console.log(`✅ Excel export completed successfully: ${excelPath}`);
      return excelPath;
    } catch (error) {
      console.error('Excel export failed:', error);
      throw new Error(`Excel export failed: ${error}`);
    }
  }

  /**
   * Get all table names from the database
   */
  private async getAllTableNames(): Promise<string[]> {
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    
    return (tables as any[]).map(t => t.table_name);
  }

  /**
   * Export a single table to a worksheet
   */
  private async exportTableToWorksheet(workbook: ExcelJS.Workbook, tableName: string): Promise<void> {
    try {
      const worksheet = workbook.addWorksheet(tableName);
      
      // Get table data
      const data = await prisma.$queryRawUnsafe(`SELECT * FROM "${tableName}" LIMIT 10000`);
      
      if (!data || (data as any[]).length === 0) {
        worksheet.addRow([`No data found in table: ${tableName}`]);
        return;
      }

      // Add headers
      const headers = Object.keys((data as any[])[0]);
      worksheet.addRow(headers);
      
      // Style headers
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      // Add data rows
      (data as any[]).forEach(row => {
        const rowData = headers.map(header => {
          const value = row[header];
          if (value instanceof Date) {
            return value.toISOString();
          }
          return value;
        });
        worksheet.addRow(rowData);
      });

      // Auto-fit columns
      worksheet.columns.forEach(column => {
        if (column.values) {
          const maxLength = Math.max(
            ...column.values.map(v => v ? v.toString().length : 0)
          );
          column.width = Math.min(maxLength + 2, 50);
        }
      });

      console.log(`📊 Exported table: ${tableName} (${(data as any[]).length} rows)`);
    } catch (error) {
      console.error(`Failed to export table ${tableName}:`, error);
      const worksheet = workbook.addWorksheet(tableName);
      worksheet.addRow([`Error exporting table: ${error}`]);
    }
  }

  /**
   * Add summary worksheet with database statistics
   */
  private async addSummaryWorksheet(workbook: ExcelJS.Workbook): Promise<void> {
    const worksheet = workbook.addWorksheet('Summary');
    
    try {
      // Get database statistics
      const stats = await this.getDatabaseStats();
      
      worksheet.addRow(['Database Export Summary']);
      worksheet.addRow(['']);
      worksheet.addRow(['Export Date:', new Date().toISOString()]);
      worksheet.addRow(['Total Tables:', stats.totalTables]);
      worksheet.addRow(['Total Records:', stats.totalRecords]);
      worksheet.addRow(['']);
      
      // Add table statistics
      worksheet.addRow(['Table', 'Record Count']);
      stats.tableStats.forEach(tableStat => {
        worksheet.addRow([tableStat.tableName, tableStat.recordCount]);
      });

      // Style the summary
      const titleRow = worksheet.getRow(1);
      titleRow.font = { bold: true, size: 16 };
      titleRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F81BD' }
      };

      // Auto-fit columns
      worksheet.columns.forEach(column => {
        column.width = 20;
      });

    } catch (error) {
      console.error('Failed to create summary worksheet:', error);
      worksheet.addRow(['Error creating summary: ' + error]);
    }
  }

  /**
   * Get database statistics
   */
  private async getDatabaseStats(): Promise<{
    totalTables: number;
    totalRecords: number;
    tableStats: Array<{ tableName: string; recordCount: number }>;
  }> {
    const tables = await this.getAllTableNames();
    const tableStats = [];

    let totalRecords = 0;
    for (const tableName of tables) {
      try {
        const result = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "${tableName}"`);
        const count = parseInt((result as any[])[0].count);
        tableStats.push({ tableName, recordCount: count });
        totalRecords += count;
      } catch (error) {
        tableStats.push({ tableName, recordCount: 0 });
      }
    }

    return {
      totalTables: tables.length,
      totalRecords,
      tableStats,
    };
  }

  /**
   * Clean up old backup files
   */
  private async cleanupOldBackups(): Promise<void> {
    try {
      const retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS || '30');
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const files = fs.readdirSync(this.backupPath);
      
      for (const file of files) {
        const filePath = path.join(this.backupPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
          console.log(`🗑️  Deleted old backup: ${file}`);
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old backups:', error);
    }
  }

  /**
   * Restore database from backup
   */
  async restoreBackup(backupFilePath: string): Promise<void> {
    try {
      if (!fs.existsSync(backupFilePath)) {
        throw new Error(`Backup file not found: ${backupFilePath}`);
      }

      if (backupFilePath.endsWith('.xlsx')) {
        throw new Error('Cannot restore from Excel file. Use SQL backup for restoration.');
      }

      // Extract database connection details
      const dbUrl = new URL(this.databaseUrl);
      const host = dbUrl.hostname;
      const port = dbUrl.port || '5432';
      const database = dbUrl.pathname.slice(1);
      const username = dbUrl.username;
      const password = dbUrl.password;

      const env = {
        ...process.env,
        PGPASSWORD: password,
      };

      // Decompress if needed
      let sqlFile = backupFilePath;
      if (backupFilePath.endsWith('.gz')) {
        await execAsync(`gunzip -k "${backupFilePath}"`);
        sqlFile = backupFilePath.replace('.gz', '');
      }

      const command = `psql -h ${host} -p ${port} -U ${username} -d ${database} -f "${sqlFile}"`;

      await execAsync(command, { env });
      
      console.log(`✅ Database restored successfully from: ${backupFilePath}`);
      
      // Clean up temporary files
      if (sqlFile !== backupFilePath) {
        fs.unlinkSync(sqlFile);
      }
    } catch (error) {
      console.error('Restore failed:', error);
      throw new Error(`Restore failed: ${error}`);
    }
  }

  /**
   * List all available backups
   */
  listBackups(): Array<{ name: string; size: number; date: Date; type: string }> {
    try {
      const files = fs.readdirSync(this.backupPath);
      const backups = [];

      for (const file of files) {
        const filePath = path.join(this.backupPath, file);
        const stats = fs.statSync(filePath);
        
        backups.push({
          name: file,
          size: stats.size,
          date: stats.mtime,
          type: file.endsWith('.xlsx') ? 'Excel' : 'SQL',
        });
      }

      return backups.sort((a, b) => b.date.getTime() - a.date.getTime());
    } catch (error) {
      console.error('Failed to list backups:', error);
      return [];
    }
  }
}

// CLI interface for running backups
if (require.main === module) {
  const backup = new DatabaseBackup();
  
  const command = process.argv[2];
  const options = process.argv[3];

  switch (command) {
    case 'backup':
      backup.createBackup({ format: options === 'excel' ? 'excel' : 'sql' })
        .then(file => console.log(`Backup completed: ${file}`))
        .catch(console.error);
      break;
      
    case 'restore':
      if (!options) {
        console.error('Please specify backup file path');
        process.exit(1);
      }
      backup.restoreBackup(options)
        .then(() => console.log('Restore completed'))
        .catch(console.error);
      break;
      
    case 'list':
      const backups = backup.listBackups();
      console.log('Available backups:');
      backups.forEach(b => {
        console.log(`- ${b.name} (${b.type}, ${(b.size / 1024 / 1024).toFixed(2)} MB, ${b.date.toISOString()})`);
      });
      break;
      
    default:
      console.log(`
Usage: 
  backup [sql|excel]  - Create backup
  restore <file>      - Restore from backup
  list                - List available backups
      `);
  }
}
