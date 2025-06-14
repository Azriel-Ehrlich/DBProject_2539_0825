import React, { useState } from 'react';
import { BarChart3, Play, Users, Calendar, TrendingUp, DollarSign, Database, Settings } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Button from './ui/Button';
import { db } from '../services/database';

export default function Reports() {
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Sample data for charts
  const membershipData = [
    { name: 'Basic', value: 150, color: '#3B82F6' },
    { name: 'Premium', value: 180, color: '#10B981' },
    { name: 'Annual', value: 70, color: '#F59E0B' }
  ];

  const attendanceData = [
    { day: 'Mon', count: 45 },
    { day: 'Tue', count: 52 },
    { day: 'Wed', count: 38 },
    { day: 'Thu', count: 48 },
    { day: 'Fri', count: 41 },
    { day: 'Sat', count: 35 },
    { day: 'Sun', count: 28 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 12500 },
    { month: 'Feb', revenue: 13200 },
    { month: 'Mar', revenue: 14100 },
    { month: 'Apr', revenue: 13800 },
    { month: 'May', revenue: 15200 },
    { month: 'Jun', revenue: 16500 }
  ];

  // Predefined queries from your SQL file
  const queries = [
    {
      id: 'members-with-membership',
      name: 'Members with Membership Details',
      description: 'List all members with their membership type, including price and duration',
      sql: `SELECT m.memberid, m.name, m.email, m.phone, ms.type AS membership_type, ms.price, ms.duration
            FROM members m
            LEFT JOIN memberships ms ON m.membershiptype = ms.membershipid
            LIMIT 10`
    },
    {
      id: 'monthly-revenue',
      name: 'Monthly Revenue Report',
      description: 'Total revenue from payments per month and year',
      sql: `SELECT EXTRACT(YEAR FROM paymentdate) AS year, EXTRACT(MONTH FROM paymentdate) AS month, SUM(amount) AS total_income
            FROM payments
            GROUP BY year, month
            ORDER BY year DESC, month DESC
            LIMIT 10`
    },
    {
      id: 'member-attendance',
      name: 'Member Attendance Statistics',
      description: 'Number of check-ins per member per month and year',
      sql: `SELECT m.memberid, m.name, EXTRACT(YEAR FROM a.date) AS year, EXTRACT(MONTH FROM a.date) AS month, COUNT(a.attendanceid) AS visits
            FROM members m
            JOIN attendance a ON m.memberid = a.memberid
            GROUP BY m.memberid, m.name, year, month
            ORDER BY year DESC, month DESC
            LIMIT 10`
    },
    {
      id: 'instructor-classes',
      name: 'Instructor Class Count',
      description: 'List of instructors including the number of classes they conduct',
      sql: `SELECT e.employeeid as instructorid, e.name, COUNT(c.classid) AS class_count
            FROM employees e
            JOIN instructors i ON e.employeeid = i.employeeid
            LEFT JOIN classes c ON e.employeeid = c.employeeid
            GROUP BY e.employeeid, e.name
            ORDER BY class_count DESC
            LIMIT 10`
    },
    {
      id: 'class-participants',
      name: 'Popular Classes',
      description: 'List of classes with participant count (only if at least 3 participants)',
      sql: `SELECT c.classid, c.classname, COUNT(cm.memberid) AS participant_count
            FROM classes c
            JOIN class_membership cm ON c.classid = cm.classid
            GROUP BY c.classid, c.classname
            HAVING COUNT(cm.memberid) >= 3
            ORDER BY participant_count DESC
            LIMIT 10`
    },
    {
      id: 'inactive-members',
      name: 'Inactive Members',
      description: 'Members who have not visited the gym in the last month',
      sql: `SELECT m.memberid, m.name, m.email, MAX(a.date) AS last_visit
            FROM members m
            LEFT JOIN attendance a ON m.memberid = a.memberid
            GROUP BY m.memberid, m.name, m.email
            HAVING MAX(a.date) < CURRENT_DATE - INTERVAL '1 month' OR MAX(a.date) IS NULL
            LIMIT 10`
    }
  ];

  // Database procedures from your files
  const procedures = [
    {
      id: 'add-attendance',
      name: 'Add Attendance Record',
      description: 'Insert a single attendance row while preventing duplicates for the same member & date',
      params: [
        { name: 'member_id', type: 'number', label: 'Member ID' },
        { name: 'date', type: 'date', label: 'Date' },
        { name: 'checkin', type: 'time', label: 'Check-in Time' },
        { name: 'checkout', type: 'time', label: 'Check-out Time (optional)' }
      ]
    },
    {
      id: 'update-hourly-rate',
      name: 'Update Employee Hourly Rate',
      description: 'Update an employee\'s hourly pay-rate with basic validation and feedback',
      params: [
        { name: 'employee_id', type: 'number', label: 'Employee ID' },
        { name: 'new_rate', type: 'number', label: 'New Hourly Rate ($)', step: '0.01' }
      ]
    }
  ];

  // Database functions from your files
  const functions = [
    {
      id: 'calc-weekly-hours',
      name: 'Calculate Weekly Hours',
      description: 'Compute total attendance hours for one member within a 7-day window',
      params: [
        { name: 'member_id', type: 'number', label: 'Member ID' },
        { name: 'week_start', type: 'date', label: 'Week Start Date' }
      ]
    },
    {
      id: 'get-cashier-orders',
      name: 'Get Cashier Orders',
      description: 'Return all orders handled by a specific cashier',
      params: [
        { name: 'cashier_id', type: 'number', label: 'Cashier ID' }
      ]
    }
  ];

  const [procedureParams, setProcedureParams] = useState<Record<string, any>>({});

  const executeQuery = async (queryId: string) => {
    setLoading(true);
    setActiveQuery(queryId);
    
    const query = queries.find(q => q.id === queryId);
    if (!query) return;

    try {
      const results = await db.executeQuery(query.sql);
      setQueryResults(results);
    } catch (error) {
      console.error('Query execution failed:', error);
      setQueryResults([]);
      alert(`Query failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const executeProcedure = async (procedureId: string) => {
    setLoading(true);
    setActiveQuery(procedureId);
    
    const procedure = procedures.find(p => p.id === procedureId);
    if (!procedure) return;

    try {
      const params = procedure.params.map(param => {
        const value = procedureParams[param.name];
        if (param.type === 'number') {
          return parseFloat(value) || 0;
        }
        return value || null;
      });
      
      const result = await db.callProcedure(procedureId.replace('-', '_'), params);
      setQueryResults([{ message: result.message || 'Procedure executed successfully' }]);
    } catch (error) {
      console.error('Procedure execution failed:', error);
      setQueryResults([{ error: error.toString() }]);
    } finally {
      setLoading(false);
    }
  };

  const executeFunction = async (functionId: string) => {
    setLoading(true);
    setActiveQuery(functionId);
    
    const func = functions.find(f => f.id === functionId);
    if (!func) return;

    try {
      const params = func.params.map(param => {
        const value = procedureParams[param.name];
        if (param.type === 'number') {
          return parseInt(value) || 0;
        }
        return value || null;
      });
      
      const result = await db.callFunction(functionId.replace('-', '_'), params);
      setQueryResults(Array.isArray(result) ? result : [result]);
    } catch (error) {
      console.error('Function execution failed:', error);
      setQueryResults([{ error: error.toString() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <BarChart3 className="w-8 h-8 mr-3 text-purple-600" />
          Reports & Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">View analytics, execute queries, and run database procedures</p>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Membership Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Membership Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={membershipData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {membershipData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Attendance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-600" />
            Weekly Attendance
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Revenue Trend (6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Custom Queries Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Database className="w-5 h-5 mr-2 text-blue-600" />
          Database Queries
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {queries.map((query) => (
            <div key={query.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{query.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{query.description}</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => executeQuery(query.id)}
                  disabled={loading}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Run
                </Button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                <code className="text-xs text-gray-700 dark:text-gray-300 break-all">{query.sql}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Database Procedures Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-green-600" />
          Database Procedures
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {procedures.map((procedure) => (
            <div key={procedure.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white">{procedure.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{procedure.description}</p>
              </div>
              
              <div className="space-y-3 mb-4">
                {procedure.params.map((param) => (
                  <div key={param.name}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {param.label}
                    </label>
                    <input
                      type={param.type}
                      step={param.step}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      onChange={(e) => setProcedureParams({
                        ...procedureParams,
                        [param.name]: e.target.value
                      })}
                    />
                  </div>
                ))}
              </div>
              
              <Button 
                size="sm" 
                onClick={() => executeProcedure(procedure.id)}
                disabled={loading}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-1" />
                Execute
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Database Functions Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Database className="w-5 h-5 mr-2 text-purple-600" />
          Database Functions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {functions.map((func) => (
            <div key={func.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white">{func.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{func.description}</p>
              </div>
              
              <div className="space-y-3 mb-4">
                {func.params.map((param) => (
                  <div key={param.name}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {param.label}
                    </label>
                    <input
                      type={param.type}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      onChange={(e) => setProcedureParams({
                        ...procedureParams,
                        [param.name]: e.target.value
                      })}
                    />
                  </div>
                ))}
              </div>
              
              <Button 
                size="sm" 
                onClick={() => executeFunction(func.id)}
                disabled={loading}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-1" />
                Execute
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {(loading || queryResults.length > 0) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Query Results</h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Executing query...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    {queryResults.length > 0 && Object.keys(queryResults[0]).map((key) => (
                      <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {key.replace('_', ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {queryResults.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      {Object.values(row).map((value: any, colIndex) => (
                        <td key={colIndex} className="px-4 py-2 text-sm text-gray-900 dark:text-gray-300">
                          {typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}