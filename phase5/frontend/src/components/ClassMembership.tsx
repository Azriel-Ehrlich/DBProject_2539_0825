import React, { useState } from 'react';
import { UserPlus, Plus, Search, Trash2, Users, Calendar } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface ClassMembership {
  memberid: number;
  classid: number;
  memberName: string;
  className: string;
  classTime: string;
}

export default function ClassMembership() {
  const [memberships, setMemberships] = useState<ClassMembership[]>([
    {
      memberid: 1,
      classid: 1,
      memberName: 'Travis Hunt',
      className: 'Morning Yoga',
      classTime: '09:00:00'
    },
    {
      memberid: 2,
      classid: 1,
      memberName: 'Vivien Mcdaniel',
      className: 'Morning Yoga',
      classTime: '09:00:00'
    },
    {
      memberid: 1,
      classid: 2,
      memberName: 'Travis Hunt',
      className: 'Pilates Core',
      classTime: '14:00:00'
    },
    {
      memberid: 3,
      classid: 3,
      memberName: 'Caleb West',
      className: 'Evening Zumba',
      classTime: '17:00:00'
    }
  ]);

  const [members] = useState([
    { memberid: 1, name: 'Travis Hunt' },
    { memberid: 2, name: 'Vivien Mcdaniel' },
    { memberid: 3, name: 'Caleb West' },
    { memberid: 4, name: 'John Doe' },
    { memberid: 5, name: 'Jane Smith' }
  ]);

  const [classes] = useState([
    { classid: 1, classname: 'Morning Yoga', classtime: '09:00:00' },
    { classid: 2, classname: 'Pilates Core', classtime: '14:00:00' },
    { classid: 3, classname: 'Evening Zumba', classtime: '17:00:00' },
    { classid: 4, classname: 'HIIT Training', classtime: '10:30:00' },
    { classid: 5, classname: 'Strength Training', classtime: '16:00:00' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  const [formData, setFormData] = useState({
    memberid: 1,
    classid: 1
  });

  const filteredMemberships = memberships.filter(membership => {
    const matchesSearch = membership.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         membership.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || membership.classid.toString() === classFilter;
    return matchesSearch && matchesClass;
  });

  const openModal = () => {
    setFormData({
      memberid: 1,
      classid: 1
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if membership already exists
    const exists = memberships.some(m => 
      m.memberid === formData.memberid && m.classid === formData.classid
    );
    
    if (exists) {
      alert('This member is already enrolled in this class');
      return;
    }
    
    const member = members.find(m => m.memberid === formData.memberid);
    const class_ = classes.find(c => c.classid === formData.classid);
    
    if (member && class_) {
      const newMembership: ClassMembership = {
        memberid: formData.memberid,
        classid: formData.classid,
        memberName: member.name,
        className: class_.classname,
        classTime: class_.classtime
      };
      setMemberships([...memberships, newMembership]);
    }
    
    closeModal();
  };

  const deleteMembership = (memberid: number, classid: number) => {
    if (confirm('Are you sure you want to remove this member from the class?')) {
      setMemberships(memberships.filter(m => 
        !(m.memberid === memberid && m.classid === classid)
      ));
    }
  };

  // Group memberships by class
  const membershipsByClass = filteredMemberships.reduce((acc, membership) => {
    const className = membership.className;
    if (!acc[className]) {
      acc[className] = [];
    }
    acc[className].push(membership);
    return acc;
  }, {} as Record<string, ClassMembership[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <UserPlus className="w-8 h-8 mr-3 text-purple-600" />
            Class Membership
          </h1>
          <p className="text-gray-600 mt-1">Manage member enrollments in classes</p>
        </div>
        <Button onClick={openModal} className="mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Enroll Member
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">{memberships.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Classes</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(membershipsByClass).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. per Class</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(membershipsByClass).length > 0 
                  ? Math.round(memberships.length / Object.keys(membershipsByClass).length)
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search members or classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div key={className} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{className}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(`2000-01-01T${classMembers[0].classTime}`).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })} • {classMembers.length} member{classMembers.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {classMembers.length} enrolled
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classMembers.map((membership) => (
                  <div 
                    key={`${membership.memberid}-${membership.classid}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {membership.memberName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{membership.memberName}</p>
                        <p className="text-xs text-gray-500">ID: {membership.memberid}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMembership(membership.memberid, membership.classid)}
                      className="text-red-600 hover:text-red-900 p-1 rounded"
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Enroll Member in Class
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Member
              </label>
              <select
                value={formData.memberid}
                onChange={(e) => setFormData({ ...formData, memberid: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {members.map((member) => (
                  <option key={member.memberid} value={member.memberid}>
                    {member.name} (ID: {member.memberid})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class
              </label>
              <select
                value={formData.classid}
                onChange={(e) => setFormData({ ...formData, classid: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {classes.map((class_) => (
                  <option key={class_.classid} value={class_.classid}>
                    {class_.classname} - {new Date(`2000-01-01T${class_.classtime}`).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
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