import React, { useState } from 'react';
import { Calendar, Plus, Search, Edit, Trash2, Clock, User } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface Class {
  classid: number;
  classname: string;
  classtime: string;
  employeeid: number;
  instructorName: string;
}

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([
    {
      classid: 1,
      classname: 'Morning Yoga',
      classtime: '09:00:00',
      employeeid: 1,
      instructorName: 'Alice Brown'
    },
    {
      classid: 2,
      classname: 'Pilates Core',
      classtime: '14:00:00',
      employeeid: 2,
      instructorName: 'Bob Green'
    },
    {
      classid: 3,
      classname: 'Evening Zumba',
      classtime: '17:00:00',
      employeeid: 3,
      instructorName: 'Charlie Black'
    }
  ]);

  const [instructors] = useState([
    { employeeid: 1, name: 'Alice Brown' },
    { employeeid: 2, name: 'Bob Green' },
    { employeeid: 3, name: 'Charlie Black' },
    { employeeid: 4, name: 'Diana White' },
    { employeeid: 5, name: 'Eve Miller' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    classname: '',
    classtime: '',
    employeeid: 1
  });

  const filteredClasses = classes.filter(class_ =>
    class_.classname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    class_.instructorName.toLowerCase().includes(searchTerm.toLowerCase())
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
        employeeid: 1
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const instructorName = instructors.find(i => i.employeeid === formData.employeeid)?.name || '';
    
    if (editingClass) {
      // Update existing class
      setClasses(classes.map(class_ => 
        class_.classid === editingClass.classid 
          ? { ...class_, ...formData, instructorName }
          : class_
      ));
    } else {
      // Add new class
      const newClass: Class = {
        classid: Math.max(...classes.map(c => c.classid)) + 1,
        ...formData,
        instructorName
      };
      setClasses([...classes, newClass]);
    }
    
    closeModal();
  };

  const deleteClass = (id: number) => {
    if (confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter(class_ => class_.classid !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-green-600" />
            Classes Management
          </h1>
          <p className="text-gray-600 mt-1">Manage gym classes and schedules</p>
        </div>
        <Button onClick={() => openModal()} className="mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search classes or instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((class_) => (
          <div key={class_.classid} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{class_.classname}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(`2000-01-01T${class_.classtime}`).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => openModal(class_)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteClass(class_.classid)}
                    className="text-red-600 hover:text-red-900 p-1 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span>{class_.instructorName}</span>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-gray-500">Class ID: {class_.classid}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingClass ? 'Edit Class' : 'Add New Class'}
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Name
              </label>
              <input
                type="text"
                value={formData.classname}
                onChange={(e) => setFormData({ ...formData, classname: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Morning Yoga, HIIT Training"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Time
              </label>
              <input
                type="time"
                value={formData.classtime}
                onChange={(e) => setFormData({ ...formData, classtime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructor
              </label>
              <select
                value={formData.employeeid}
                onChange={(e) => setFormData({ ...formData, employeeid: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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