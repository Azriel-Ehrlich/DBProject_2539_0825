import React from 'react';
import { Users, Calendar, Briefcase, Package, TrendingUp, Clock, Award, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      name: 'Total Members',
      value: '400',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Classes',
      value: '24',
      change: '+3',
      changeType: 'increase',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      name: 'Staff Members',
      value: '45',
      change: '+5',
      changeType: 'increase',
      icon: Briefcase,
      color: 'bg-purple-500'
    },
    {
      name: 'Products',
      value: '283',
      change: '+18',
      changeType: 'increase',
      icon: Package,
      color: 'bg-orange-500'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New member registered', member: 'John Doe', time: '2 minutes ago', type: 'member' },
    { id: 2, action: 'Class attendance updated', member: 'Morning Yoga', time: '15 minutes ago', type: 'class' },
    { id: 3, action: 'Product order placed', member: 'Order #1052', time: '1 hour ago', type: 'order' },
    { id: 4, action: 'New instructor added', member: 'Sarah Wilson', time: '2 hours ago', type: 'staff' },
    { id: 5, action: 'Membership renewed', member: 'Mike Johnson', time: '3 hours ago', type: 'member' }
  ];

  const upcomingClasses = [
    { id: 1, name: 'Morning Yoga', time: '09:00 AM', instructor: 'Alice Brown', spots: 8 },
    { id: 2, name: 'HIIT Training', time: '10:30 AM', instructor: 'Bob Green', spots: 12 },
    { id: 3, name: 'Pilates', time: '02:00 PM', instructor: 'Charlie Black', spots: 6 },
    { id: 4, name: 'Strength Training', time: '05:00 PM', instructor: 'Diana White', spots: 15 }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
            <p className="text-blue-100 text-lg">
              Here's what's happening at your gym today
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activities
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'member' ? 'bg-blue-500' :
                  activity.type === 'class' ? 'bg-green-500' :
                  activity.type === 'order' ? 'bg-orange-500' : 'bg-purple-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.member}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Today's Classes
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {upcomingClasses.map((class_) => (
              <div key={class_.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{class_.name}</h4>
                  <p className="text-sm text-gray-600">{class_.instructor}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{class_.time}</p>
                  <p className="text-xs text-gray-500">{class_.spots} spots left</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Add New Member</span>
          </button>
          <button className="flex items-center justify-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <Calendar className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Schedule Class</span>
          </button>
          <button className="flex items-center justify-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <Award className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-900">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}