import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';
import { requireStaff } from '../middleware/auth';

const router = Router();

// Validation middleware
const validateInventoryItem = [
  body('name').isString().notEmpty().withMessage('Item name is required'),
  body('category').isIn(['SUPPLIES', 'EQUIPMENT', 'MEDICATIONS', 'CONSUMABLES', 'TOOLS']).withMessage('Valid category is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Valid quantity is required'),
  body('minQuantity').isInt({ min: 0 }).withMessage('Valid minimum quantity is required'),
  body('unit').isString().notEmpty().withMessage('Unit is required'),
  body('cost').isFloat({ min: 0 }).withMessage('Valid cost is required'),
  body('supplier').optional().isString().withMessage('Supplier must be a string'),
  body('location').optional().isString().withMessage('Location must be a string'),
];

const validateSearch = [
  query('q').optional().isString().withMessage('Search query must be a string'),
  query('category').optional().isIn(['SUPPLIES', 'EQUIPMENT', 'MEDICATIONS', 'CONSUMABLES', 'TOOLS']).withMessage('Valid category is required'),
  query('status').optional().isIn(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK']).withMessage('Valid status is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

// @route   GET /api/inventory
// @desc    Get all inventory items with filtering and pagination
// @access  Private
router.get('/', validateSearch, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { q: searchQuery, category, status, page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  // Build search conditions
  const where: any = { isActive: true };
  
  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery as string, mode: 'insensitive' } },
      { description: { contains: searchQuery as string, mode: 'insensitive' } },
      { supplier: { contains: searchQuery as string, mode: 'insensitive' } },
      { location: { contains: searchQuery as string, mode: 'insensitive' } },
    ];
  }
  
  if (category) {
    where.category = category;
  }
  
  if (status) {
    switch (status) {
      case 'LOW_STOCK':
        where.quantity = { lte: prisma.inventory.fields.minQuantity };
        break;
      case 'OUT_OF_STOCK':
        where.quantity = 0;
        break;
      case 'IN_STOCK':
        where.quantity = { gt: prisma.inventory.fields.minQuantity };
        break;
    }
  }

  // Get inventory items with count
  const [inventoryItems, totalCount] = await Promise.all([
    prisma.inventory.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { name: 'asc' },
    }),
    prisma.inventory.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / Number(limit));

  res.json({
    inventoryItems,
    pagination: {
      currentPage: Number(page),
      totalPages,
      totalCount,
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1,
    },
  });
}));

// @route   GET /api/inventory/:id
// @desc    Get inventory item by ID
// @access  Private
router.get('/:id', requireStaff, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const inventoryItem = await prisma.inventory.findUnique({
    where: { id },
  });

  if (!inventoryItem) {
    return res.status(404).json({
      error: 'Inventory item not found',
      message: 'Inventory item with the specified ID does not exist',
    });
  }

  res.json({ inventoryItem });
}));

// @route   POST /api/inventory
// @desc    Create a new inventory item
// @access  Private
router.post('/', validateInventoryItem, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const inventoryData = req.body;

  // Check if item with same name already exists
  const existingItem = await prisma.inventory.findFirst({
    where: {
      name: { equals: inventoryData.name, mode: 'insensitive' },
      isActive: true,
    },
  });

  if (existingItem) {
    return res.status(409).json({
      error: 'Item already exists',
      message: 'An inventory item with this name already exists',
    });
  }

  const inventoryItem = await prisma.inventory.create({
    data: inventoryData,
  });

  res.status(201).json({
    message: 'Inventory item created successfully',
    inventoryItem,
  });
}));

// @route   PUT /api/inventory/:id
// @desc    Update inventory item
// @access  Private
router.put('/:id', validateInventoryItem, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { id } = req.params;
  const updateData = req.body;

  // Check if inventory item exists
  const existingItem = await prisma.inventory.findUnique({
    where: { id },
  });

  if (!existingItem) {
    return res.status(404).json({
      error: 'Inventory item not found',
      message: 'Inventory item with the specified ID does not exist',
    });
  }

  // Check if name conflicts with other active items
  if (updateData.name !== existingItem.name) {
    const nameConflict = await prisma.inventory.findFirst({
      where: {
        name: { equals: updateData.name, mode: 'insensitive' },
        isActive: true,
        id: { not: id },
      },
    });

    if (nameConflict) {
      return res.status(409).json({
        error: 'Name conflict',
        message: 'An inventory item with this name already exists',
      });
    }
  }

  const inventoryItem = await prisma.inventory.update({
    where: { id },
    data: updateData,
  });

  res.json({
    message: 'Inventory item updated successfully',
    inventoryItem,
  });
}));

// @route   PATCH /api/inventory/:id/quantity
// @desc    Update inventory quantity
// @access  Private
router.patch('/:id/quantity', [
  body('quantity').isInt({ min: 0 }).withMessage('Valid quantity is required'),
  body('reason').isString().notEmpty().withMessage('Reason for quantity change is required'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
], requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { id } = req.params;
  const { quantity, reason, notes } = req.body;

  // Check if inventory item exists
  const existingItem = await prisma.inventory.findUnique({
    where: { id },
  });

  if (!existingItem) {
    return res.status(404).json({
      error: 'Inventory item not found',
      message: 'Inventory item with the specified ID does not exist',
    });
  }

  const oldQuantity = existingItem.quantity;
  const newQuantity = quantity;

  // Update inventory item
  const inventoryItem = await prisma.inventory.update({
    where: { id },
    data: { quantity: newQuantity },
  });

  // Create inventory transaction record
  await prisma.inventoryTransaction.create({
    data: {
      inventoryId: id,
      type: newQuantity > oldQuantity ? 'IN' : 'OUT',
      quantity: Math.abs(newQuantity - oldQuantity),
      reason,
      notes,
      recordedBy: (req as any).user.id,
      previousQuantity: oldQuantity,
      newQuantity,
    },
  });

  res.json({
    message: 'Inventory quantity updated successfully',
    inventoryItem,
    change: {
      type: newQuantity > oldQuantity ? 'IN' : 'OUT',
      quantity: Math.abs(newQuantity - oldQuantity),
      reason,
    },
  });
}));

// @route   DELETE /api/inventory/:id
// @desc    Delete inventory item (soft delete)
// @access  Private
router.delete('/:id', requireStaff, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if inventory item exists
  const existingItem = await prisma.inventory.findUnique({
    where: { id },
  });

  if (!existingItem) {
    return res.status(404).json({
      error: 'Inventory item not found',
      message: 'Inventory item with the specified ID does not exist',
    });
  }

  // Soft delete
  await prisma.inventory.update({
    where: { id },
    data: { isActive: false },
  });

  res.json({
    message: 'Inventory item deleted successfully',
  });
}));

// @route   GET /api/inventory/low-stock
// @desc    Get low stock items
// @access  Private
router.get('/low-stock', requireStaff, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [lowStockItems, totalCount] = await Promise.all([
    prisma.inventory.findMany({
      where: {
        quantity: { lte: prisma.inventory.fields.minQuantity },
        isActive: true,
      },
      skip,
      take: Number(limit),
      orderBy: { quantity: 'asc' },
    }),
    prisma.inventory.count({
      where: {
        quantity: { lte: prisma.inventory.fields.minQuantity },
        isActive: true,
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / Number(limit));

  res.json({
    lowStockItems,
    pagination: {
      currentPage: Number(page),
      totalPages,
      totalCount,
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1,
    },
  });
}));

// @route   GET /api/inventory/transactions/:id
// @desc    Get transaction history for an inventory item
// @access  Private
router.get('/transactions/:id', requireStaff, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  // Check if inventory item exists
  const existingItem = await prisma.inventory.findUnique({
    where: { id },
  });

  if (!existingItem) {
    return res.status(404).json({
      error: 'Inventory item not found',
      message: 'Inventory item with the specified ID does not exist',
    });
  }

  const [transactions, totalCount] = await Promise.all([
    prisma.inventoryTransaction.findMany({
      where: { inventoryId: id },
      skip,
      take: Number(limit),
      orderBy: { timestamp: 'desc' },
      include: {
        recordedByUser: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
    prisma.inventoryTransaction.count({ where: { inventoryId: id } }),
  ]);

  const totalPages = Math.ceil(totalCount / Number(limit));

  res.json({
    transactions,
    pagination: {
      currentPage: Number(page),
      totalPages,
      totalCount,
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1,
    },
  });
}));

// @route   POST /api/inventory/bulk-update
// @desc    Bulk update inventory quantities
// @access  Private
router.post('/bulk-update', [
  body('updates').isArray().withMessage('Updates must be an array'),
  body('updates.*.id').isString().notEmpty().withMessage('Item ID is required'),
  body('updates.*.quantity').isInt({ min: 0 }).withMessage('Valid quantity is required'),
  body('updates.*.reason').isString().notEmpty().withMessage('Reason is required'),
], requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { updates } = req.body;

  // Validate all items exist
  const itemIds = updates.map((update: any) => update.id);
  const existingItems = await prisma.inventory.findMany({
    where: { id: { in: itemIds } },
  });

  if (existingItems.length !== itemIds.length) {
    return res.status(400).json({
      error: 'Invalid items',
      message: 'Some inventory items do not exist',
    });
  }

  const results = [];

  // Process updates in transaction
  for (const update of updates) {
    const item = existingItems.find(i => i.id === update.id);
    if (!item) continue;

    const oldQuantity = item.quantity;
    const newQuantity = update.quantity;

    // Update inventory
    const updatedItem = await prisma.inventory.update({
      where: { id: update.id },
      data: { quantity: newQuantity },
    });

    // Create transaction record
    await prisma.inventoryTransaction.create({
      data: {
        inventoryId: update.id,
        type: newQuantity > oldQuantity ? 'IN' : 'OUT',
        quantity: Math.abs(newQuantity - oldQuantity),
        reason: update.reason,
        recordedBy: (req as any).user.id,
        previousQuantity: oldQuantity,
        newQuantity,
      },
    });

    results.push({
      id: update.id,
      name: item.name,
      oldQuantity,
      newQuantity,
      change: newQuantity - oldQuantity,
    });
  }

  res.json({
    message: 'Bulk update completed successfully',
    results,
    totalUpdated: results.length,
  });
}));

// @route   GET /api/inventory/report/stock-value
// @desc    Get inventory stock value report
// @access  Private
router.get('/report/stock-value', requireStaff, asyncHandler(async (req, res) => {
  try {
    const inventoryItems = await prisma.inventory.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        category: true,
        quantity: true,
        cost: true,
        minQuantity: true,
      },
    });

    const stockValue = inventoryItems.reduce((total, item) => {
      return total + (item.quantity * item.cost);
    }, 0);

    const categoryBreakdown = inventoryItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          count: 0,
          totalValue: 0,
          items: [],
        };
      }
      
      acc[item.category].count++;
      acc[item.category].totalValue += item.quantity * item.cost;
      acc[item.category].items.push({
        name: item.name,
        quantity: item.quantity,
        value: item.quantity * item.cost,
        status: item.quantity <= item.minQuantity ? 'LOW_STOCK' : 'IN_STOCK',
      });
      
      return acc;
    }, {} as Record<string, any>);

    const lowStockCount = inventoryItems.filter(item => item.quantity <= item.minQuantity).length;
    const outOfStockCount = inventoryItems.filter(item => item.quantity === 0).length;

    res.json({
      summary: {
        totalItems: inventoryItems.length,
        totalStockValue: stockValue,
        lowStockCount,
        outOfStockCount,
      },
      categoryBreakdown,
      reportDate: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Stock value report error:', error);
    res.status(500).json({
      error: 'Failed to generate stock value report',
      message: 'An error occurred while generating the report',
    });
  }
}));

export default router;
