'use client'

export default function StatCard({ title, value, icon: Icon, color, change, changeType }) {
  return (
    <div className="glass-card p-6 hover:shadow-apple-hover transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-apple-gray mb-1">{title}</p>
          <p className="text-2xl font-bold text-apple-dark">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${
                changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change}
              </span>
              <span className="text-xs text-apple-gray ml-1">from last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}
