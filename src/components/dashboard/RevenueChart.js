'use client'

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default function RevenueChart() {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d')
      
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Revenue',
              data: [4500, 5200, 4800, 6100, 5800, 7200],
              backgroundColor: 'rgba(147, 51, 234, 0.8)',
              borderColor: '#9333EA',
              borderWidth: 0,
              borderRadius: 8,
              borderSkipped: false,
              hoverBackgroundColor: '#9333EA'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                color: '#8E8E93',
                font: {
                  size: 12
                },
                callback: function(value) {
                  return '$' + value.toLocaleString()
                }
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#8E8E93',
                font: {
                  size: 12
                }
              }
            }
          },
          elements: {
            bar: {
              borderRadius: 8
            }
          }
        }
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <div className="h-64">
      <canvas ref={chartRef} />
    </div>
  )
}
