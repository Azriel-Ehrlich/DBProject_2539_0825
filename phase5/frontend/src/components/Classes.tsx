import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Edit, Trash2, Clock, User } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { db } from '../services/database';

interface Class {
  classid: number;
  classname: string;
  classtime: string;
  employeeid: number;
  instructor_name: string;
}

interface Instructor {
  employeeid: number;
  name: string;
}

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    classname: '',
    classtime: '',
    employeeid: 1
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [classesData, instructorsData] = await Promise.all([
        db.getClasses(),
        db.getInstructors()
      ]);
      setClasses(classesData);
      setInstructors(instructorsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter(class_ =>
    class_.classname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (class_.instructor_name && class_.instructor_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openModal = (class_?: Class) => {
    if (class_) {
      setEditingClass(class_);
      setFormData({
        classname: class_.classname,
        classtime: class_.classtime,
        employeeid: class_.employeeid
      });
    } else {
      setEditingClass(null);
      setFormData({
        classname: '',
        classtime: '',
        employeeid: instructors[0]?.employeeid || 1
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingClass) {
        await db.updateClass(editingClass.classid, formData);
      } else {
        await db.createClass(formData);
      }
      await loadData();
      closeModal();
    } catch (error) {
      console.error('Failed to save class:', error);
      alert('Failed to save class. Please try again.');
    }
  };

  const deleteClass = async (id: number) => {
    if (confirm('Are you sure you want to delete this class?')) {
      try {
        await db.deleteClass(id);
        await loadData();
      } catch (error) {
        console.error('Failed to delete class:', error);
        alert('Failed to delete class. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading classes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-green-600" />
            Classes Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage gym classes and schedules</p>
        </div>
        <Button onClick={() => openModal()} className="mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Classes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{classes.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Instructors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{instructors.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Classes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {classes.filter(c => {
                  const classTime = new Date(`2000-01-01T${c.classtime}`);
                  const now = new Date();
                  return classTime.getHours() >= now.getHours();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search classes or instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((class_) => (
          <div key={class_.classid} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{class_.classname}</h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {class_.classtime ? new Date(`2000-01-01T${class_.classtime}`).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : 'No time set'}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => openModal(class_)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteClass(class_.classid)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4 mr-2" />
                <span>{class_.instructor_name || 'No instructor assigned'}</span>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">Class ID: {class_.classid}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Active
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {editingClass ? 'Edit Class' : 'Add New Class'}
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Class Name
              </label>
              <input
                type="text"
                value={formData.classname}
                onChange={(e) => setFormData({ ...formData, classname: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Morning Yoga, HIIT Training"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Class Time
              </label>
              <input
                type="time"
                value={formData.classtime}
                onChange={(e) => setFormData({ ...formData, classtime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instructor
              </label>
              <select
                value={formData.employeeid}
                onChange={(e) => setFormData({ ...formData, employeeid: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {instructors.map((instructor) => (
                  <option key={instructor.employeeid} value={instructor.employeeid}>
                    {instructor.name}
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
              {editingClass ? 'Update Class' : 'Add Class'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}