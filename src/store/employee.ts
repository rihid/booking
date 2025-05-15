import { bookingUrl } from '@/lib/data/endpoints'
import axios from 'axios'
import { createStore } from 'zustand/vanilla'

interface EmployeeType {
  id: string
  employee_no: string | null
  position_id: string | null
  position: string | null
  department_id: string | null
  department: string | null
  name: string | null
  email: string | null
  phone: string | null
  address: string | any
  vat: string | any
  identity_type: any
  identity_number: string | any
  status: string | any
  job_start: string | null
  job_end: string | any
  bank_account_no: string | null
  bank_account_name: string | null
  bank_id: string | null
  grade_id: string | any
  picture: string | any
  birthday: string | any
  birthplace: string | any
  org_no: string | null
  branch_no: string | any
  active: boolean
}

export type EmployeeState = {
  employeehList: EmployeeType[]
}

export type EmployeeActions = {
  getEmployeeList: (token: string) => Promise<void>;
}

export type EmployeeStore = EmployeeState & EmployeeActions

export const initEmployeeStore = (): EmployeeState => {
  return {
    employeehList: []
  }
}

export const defaultInitState: EmployeeState = {
  employeehList: []
}

export const createEmployeeStore = (
  initState: EmployeeState = defaultInitState,
) => {
  return createStore<EmployeeStore>()((set) => ({
    ...initState,
    getEmployeeList: async (token) => {
      try {
        const response = await axios.get(bookingUrl + '/employee', {
          headers: { Accept: 'application/json', Authorization: 'Bearer ' + token },
          timeout: 50000
        });
        set({ employeehList: response.data.data });
      } catch (error: any) {
        console.log(error);
      }
    }
  }))
}