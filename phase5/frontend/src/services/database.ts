// Database service for PostgreSQL connection via backend API

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export class DatabaseService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001/api') {
    this.baseUrl = baseUrl;
  }

  // Test database connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/test`);
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  // Execute custom SQL queries
  async executeQuery(query: string, params: any[] = []): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, params })
      });
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      console.error('Query execution failed:', error);
      throw error;
    }
  }

  // Call stored procedures
  async callProcedure(procedureName: string, params: any[]): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/procedure/${procedureName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ params })
      });
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    } catch (error) {
      console.error('Procedure call failed:', error);
      throw error;
    }
  }

  // Call database functions
  async callFunction(functionName: string, params: any[]): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/function/${functionName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ params })
      });
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      console.error('Function call failed:', error);
      throw error;
    }
  }

  // CRUD Operations for Members
  async getMembers(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/members`);
    if (!response.ok) throw new Error('Failed to fetch members');
    return response.json();
  }

  async createMember(member: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    });
    if (!response.ok) throw new Error('Failed to create member');
    return response.json();
  }

  async updateMember(id: number, member: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    });
    if (!response.ok) throw new Error('Failed to update member');
    return response.json();
  }

  async deleteMember(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/members/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete member');
  }

  // CRUD Operations for Classes
  async getClasses(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/classes`);
    if (!response.ok) throw new Error('Failed to fetch classes');
    return response.json();
  }

  async createClass(classData: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classData)
    });
    if (!response.ok) throw new Error('Failed to create class');
    return response.json();
  }

  async updateClass(id: number, classData: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/classes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classData)
    });
    if (!response.ok) throw new Error('Failed to update class');
    return response.json();
  }

  async deleteClass(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/classes/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete class');
  }

  // CRUD Operations for Employees
  async getEmployees(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/employees`);
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
  }

  async createEmployee(employee: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee)
    });
    if (!response.ok) throw new Error('Failed to create employee');
    return response.json();
  }

  async updateEmployee(id: number, employee: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee)
    });
    if (!response.ok) throw new Error('Failed to update employee');
    return response.json();
  }

  async deleteEmployee(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/employees/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete employee');
  }

  // CRUD Operations for Products
  async getProducts(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  }

  async createProduct(product: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  }

  async updateProduct(id: number, product: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  }

  async deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/products/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete product');
  }

  // CRUD Operations for Class Membership
  async getClassMembership(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/class-membership`);
    if (!response.ok) throw new Error('Failed to fetch class membership');
    return response.json();
  }

  async createClassMembership(membership: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/class-membership`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(membership)
    });
    if (!response.ok) throw new Error('Failed to create class membership');
    return response.json();
  }

  async deleteClassMembership(memberId: number, classId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/class-membership/${memberId}/${classId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete class membership');
  }

  // Helper methods for dropdowns
  async getMemberships(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/memberships`);
    if (!response.ok) throw new Error('Failed to fetch memberships');
    return response.json();
  }

  async getInstructors(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/instructors`);
    if (!response.ok) throw new Error('Failed to fetch instructors');
    return response.json();
  }
}

// Create database service instance
export const db = new DatabaseService();