import { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import { Button } from '../components/Button'
import { getHealthCheck, getTest } from '../utils/api'

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [stats] = useState({
    consultations: 12,
    reports: 8,
    symptoms: 45,
  })

  const [recentAssessments] = useState([
    {
      id: 1,
      date: 'April 20, 2026',
      condition: 'Vata Imbalance',
      status: 'Completed',
      severity: 'Moderate',
    },
    {
      id: 2,
      date: 'April 19, 2026',
      condition: 'Pitta Aggravation',
      status: 'Completed',
      severity: 'Mild',
    },
    {
      id: 3,
      date: 'April 18, 2026',
      condition: 'Kapha Excess',
      status: 'In Progress',
      severity: 'Mild',
    },
  ])

  const [apiData, setApiData] = useState({
    healthCheck: null,
    test: null,
  })

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const healthCheckData = await getHealthCheck()
        const testData = await getTest()
        setApiData({
          healthCheck: healthCheckData,
          test: testData,
        })
      } catch (error) {
        console.error('Error fetching API data:', error)
      }
    }
    fetchApiData()
  }, [])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Severe':
        return 'text-red-600 bg-red-50'
      case 'Moderate':
        return 'text-yellow-600 bg-yellow-50'
      case 'Mild':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-slate-600 bg-slate-50'
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-20 w-full lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-2 text-slate-600">Welcome back, <span className="font-semibold">{user.email}</span>!</p>
          </div>

          {/* API Data */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">API Status</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Health Check</CardTitle>
                  <CardDescription>Backend connection status</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    {apiData.healthCheck ? apiData.healthCheck.data.message : 'Loading...'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Test Endpoint</CardTitle>
                  <CardDescription>API test response</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    {apiData.test ? apiData.test.data.message : 'Loading...'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">📋 {stats.consultations}</CardTitle>
                <CardDescription>Total Consultations</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">📊 {stats.reports}</CardTitle>
                <CardDescription>Reports Generated</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">🩺 {stats.symptoms}</CardTitle>
                <CardDescription>Symptoms Tracked</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Health Status Overview */}
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Health Status Overview</CardTitle>
                <CardDescription>Your current constitutional balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-slate-700">Vata</span>
                      <span className="text-sm text-slate-500">65%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div className="h-full w-[65%] rounded-full bg-blue-500"></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-slate-700">Pitta</span>
                      <span className="text-sm text-slate-500">40%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div className="h-full w-[40%] rounded-full bg-orange-500"></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-slate-700">Kapha</span>
                      <span className="text-sm text-slate-500">55%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div className="h-full w-[55%] rounded-full bg-green-500"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and functions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="primary" className="w-full justify-start" size="lg">
                    🩺 New Assessment
                  </Button>
                  <Button variant="secondary" className="w-full justify-start" size="lg">
                    📋 View Reports
                  </Button>
                  <Button variant="secondary" className="w-full justify-start" size="lg">
                    📜 Check History
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    ⚙️ Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Assessments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Assessments</CardTitle>
              <CardDescription>Your latest health assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Condition</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Severity</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAssessments.map((assessment) => (
                      <tr key={assessment.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-4 text-sm text-slate-900">{assessment.date}</td>
                        <td className="px-4 py-4 text-sm text-slate-900">{assessment.condition}</td>
                        <td className="px-4 py-4 text-sm">
                          <span className="inline-flex rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                            {assessment.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getSeverityColor(assessment.severity)}`}>
                            {assessment.severity}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
