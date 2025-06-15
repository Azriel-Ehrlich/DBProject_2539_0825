import React, { useState, useEffect } from 'react';
import { UserPlus, Plus, Search, Trash2, Users, Calendar } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { db } from '../services/database';

interface ClassMembership {
  memberid: number;
  classid: number;
  member_name: string;
  classname: string;
  classtime: string;
}

interface Member {
  memberid: number;
  name: string;
}

interface Class {
  classid: number;
  classname: string;
  classtime: string;
}

export default function ClassMembership() {
  const [memberships, setMemberships] = useState<ClassMembership[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  const [formData, setFormData] = useState({
    memberid: 1,
    classid: 1
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [membershipsData, membersData, classesData] = await Promise.all([
        db.getClassMembership(),
        db.getMembers(),
        db.getClasses()
      ]);
      setMemberships(membershipsData);
      setMembers(membersData);
      setClasses(classesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMemberships = memberships.filter(membership => {
    const matchesSearch = membership.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         membership.classname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || membership.classid.toString() === classFilter;
    return matchesSearch && matchesClass;
  });

  const openModal = () => {
    setFormData({
      memberid: members[0]?.memberid || 1,
      classid: classes[0]?.classid || 1
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await db.createClassMembership(formData);
      await loadData();
      closeModal();
    } catch (error) {
      console.error('Failed to create class membership:', error);
      alert('Failed to enroll member. Please try again.');
    }
  };

  const deleteMembership = async (memberid: number, classid: number) => {
    if (confirm('Are you sure you want to remove this member from the class?')) {
      try {
        await db.deleteClassMembership(memberid, classid);
        await loadData();
      } catch (error) {
        console.error('Failed to delete class membership:', error);
        alert('Failed to remove enrollment. Please try again.');
      }
    }
  };

  // Group memberships by class
  const membershipsByClass = filteredMemberships.reduce((acc, membership) => {
    const className = membership.classname;
    if (!acc[className]) {
      acc[className] = [];
    }
    acc[className].push(membership);
    return acc;
  }, {} as Record<string, ClassMembership[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading class memberships...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <UserPlus className="w-8 h-8 mr-3 text-purple-600" />
            Class Membership
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage member enrollments in classes</p>
        </div>
        <Button onClick={openModal} className="mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Enroll Member
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{memberships.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Classes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{Object.keys(membershipsByClass).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. per Class</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Object.keys(membershipsByClass).length > 0 
                  ? Math.round(memberships.length / Object.keys(membershipsByClass).length)
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search members or classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Classes</option>
              {classes.map((class_) => (
                <option key={class_.classid} value={class_.classid.toString()}>
                  {class_.classname}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Memberships by Class */}
      <div className="space-y-6">
        {Object.entries(membershipsByClass).map(([className, classMembers]) => (
          <div key={className} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{className}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {classMembers[0].classtime ? new Date(`2000-01-01T${classMembers[0].classtime}`).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : 'No time set'} • {classMembers.length} member{classMembers.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {classMembers.length} enrolled
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classMembers.map((membership) => (
                  <div 
                    key={`${membership.memberid}-${membership.classid}`}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {membership.member_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{membership.member_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {membership.memberid}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMembership(membership.memberid, membership.classid)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enroll Member Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Enroll Member in Class
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Member
              </label>
              <select
                value={formData.memberid}
                onChange={(e) => setFormData({ ...formData, memberid: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {members.map((member) => (
                  <option key={member.memberid} value={member.memberid}>
                    {member.name} (ID: {member.memberid})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Class
              </label>
              <select
                value={formData.classid}
                onChange={(e) => setFormData({ ...formData, classid: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {classes.map((class_) => (
                  <option key={class_.classid} value={class_.classid}>
                    {class_.classname} - {class_.classtime ? new Date(`2000-01-01T${class_.classtime}`).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : 'No time set'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">
              Enroll Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}