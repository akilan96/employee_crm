import { createClient } from '@supabase/supabase-js';
import { INITIAL_EMPLOYEES } from '../data/employeesData.js';

// 1. Get Supabase Credentials from Environment Variables or LocalStorage
export const getSupabaseConfig = () => {
  if (typeof localStorage !== 'undefined') {
    const localConfig = localStorage.getItem('neekan_supabase_config');
    if (localConfig) {
      try {
        const parsed = JSON.parse(localConfig);
        if (parsed.url && parsed.anonKey) {
          return {
            url: parsed.url.trim(),
            anonKey: parsed.anonKey.trim(),
            source: 'localStorage'
          };
        }
      } catch (e) {
        console.error('Failed to parse local Supabase config', e);
      }
    }
  }

  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL);
  const envAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY);

  if (envUrl && envAnonKey && envUrl.startsWith('http')) {
    return {
      url: envUrl.trim(),
      anonKey: envAnonKey.trim(),
      source: 'env'
    };
  }

  return { url: '', anonKey: '', source: 'none' };
};

export const isSupabaseConfigured = () => {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey);
};

// 2. Initialize Supabase Client (singleton)
let supabaseInstance = null;
let currentConfigKey = '';

export const getSupabaseClient = () => {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) return null;

  const configKey = `${config.url}_${config.anonKey}`;
  if (supabaseInstance && currentConfigKey === configKey) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
    currentConfigKey = configKey;
    return supabaseInstance;
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    return null;
  }
};

// 3. Data Transformation Helpers (CamelCase <-> Snake_case)
export const mapDbToEmployee = (row) => {
  if (!row) return null;
  return {
    _id: row.internal_id || String(row.id),
    id: row.emp_id || (row.is_id_not_provided ? 'Not Provided' : String(row.id)),
    isIdNotProvided: Boolean(row.is_id_not_provided),
    name: row.name || '',
    email: row.email || '',
    companyName: row.company_name || 'Neekan Consulting LLP',
    mobile: row.mobile || '',
    linkedin: row.linkedin || '',
    bloodGroup: row.blood_group || 'O+',
    address: row.address || '',
    department: row.department === 'UI/UX & Digital Marketing' ? 'UI/UX' : (row.department || 'Software Engineer'),
    role: row.role || '',
    overallExp: row.overall_exp !== undefined && row.overall_exp !== null ? Number(row.overall_exp) : 3.0,
    neekanExp: row.neekan_exp !== undefined && row.neekan_exp !== null ? Number(row.neekan_exp) : 1.5,
    experience: row.experience || `${Number(row.overall_exp || 3.0).toFixed(1)} Yrs`,
    joiningDate: row.joining_date || new Date().toISOString().split('T')[0],
    pic: row.pic || '',
    status: row.status || 'Active',
    skills: Array.isArray(row.skills) ? row.skills : (typeof row.skills === 'string' ? row.skills.split(',').map(s => s.trim()).filter(Boolean) : []),
    createdAt: row.created_at || new Date().toISOString()
  };
};

export const mapEmployeeToDb = (emp) => {
  const internalId = emp._id || (emp.id && emp.id !== 'Not Provided' ? emp.id : `emp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`);
  return {
    internal_id: internalId,
    emp_id: emp.id === 'Not Provided' ? null : emp.id,
    is_id_not_provided: emp.id === 'Not Provided' || Boolean(emp.isIdNotProvided),
    name: emp.name || '',
    email: emp.email || '',
    company_name: emp.companyName || 'Neekan Consulting LLP',
    mobile: emp.mobile || '',
    linkedin: emp.linkedin || '',
    blood_group: emp.bloodGroup || 'O+',
    address: emp.address || '',
    department: emp.department || 'Software Engineer',
    role: emp.role || '',
    overall_exp: Number(emp.overallExp) || 0,
    neekan_exp: Number(emp.neekanExp) || 0,
    experience: emp.experience || `${Number(emp.overallExp || 0).toFixed(1)} Yrs`,
    joining_date: emp.joiningDate || new Date().toISOString().split('T')[0],
    pic: emp.pic || '',
    status: emp.status || 'Active',
    skills: Array.isArray(emp.skills) ? emp.skills : (typeof emp.skills === 'string' ? emp.skills.split(',').map(s => s.trim()).filter(Boolean) : [])
  };
};

// 4. Supabase CRUD Operations
export const fetchEmployeesFromSupabase = async () => {
  const client = getSupabaseClient();
  if (!client) return { success: false, data: null, error: 'Supabase not configured' };

  try {
    const { data, error } = await client
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      // Seed default employees if table is empty
      console.log('Supabase table is empty. Seeding initial employee records...');
      const seedPayload = INITIAL_EMPLOYEES.map(mapEmployeeToDb);
      const { data: seeded, error: seedError } = await client
        .from('employees')
        .insert(seedPayload)
        .select();

      if (!seedError && seeded) {
        return { success: true, data: seeded.map(mapDbToEmployee), isSeeded: true };
      }
      return { success: true, data: INITIAL_EMPLOYEES, isSeeded: false };
    }

    return { success: true, data: data.map(mapDbToEmployee) };
  } catch (error) {
    console.error('Supabase fetch error:', error);
    return { success: false, data: null, error: error.message || error };
  }
};

export const insertEmployeeToSupabase = async (employee) => {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not configured' };

  try {
    const dbPayload = mapEmployeeToDb(employee);
    const { data, error } = await client
      .from('employees')
      .insert([dbPayload])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: mapDbToEmployee(data) };
  } catch (error) {
    console.error('Supabase insert error:', error);
    return { success: false, error: error.message || error };
  }
};

export const updateEmployeeInSupabase = async (employee) => {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not configured' };

  try {
    const dbPayload = mapEmployeeToDb(employee);
    const internalId = employee._id || dbPayload.internal_id;

    // First try updating by internal_id
    let query = client.from('employees').update(dbPayload);
    if (internalId) {
      query = query.eq('internal_id', internalId);
    } else if (employee.id && employee.id !== 'Not Provided') {
      query = query.eq('emp_id', employee.id);
    } else {
      query = query.eq('email', employee.email);
    }

    const { data, error } = await query.select();
    if (error) throw error;
    return { success: true, data: data && data.length > 0 ? mapDbToEmployee(data[0]) : employee };
  } catch (error) {
    console.error('Supabase update error:', error);
    return { success: false, error: error.message || error };
  }
};

export const deleteEmployeeFromSupabase = async (employee) => {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not configured' };

  try {
    let query = client.from('employees').delete();
    if (employee._id) {
      query = query.eq('internal_id', employee._id);
    } else if (employee.id && employee.id !== 'Not Provided') {
      query = query.eq('emp_id', employee.id);
    } else if (employee.email) {
      query = query.eq('email', employee.email);
    }

    const { error } = await query;
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Supabase delete error:', error);
    return { success: false, error: error.message || error };
  }
};

// 5. Real-time Subscription Channel
export const subscribeToEmployeesRealtime = (onEvent) => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const channel = client
      .channel('public:employees')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'employees' },
        (payload) => {
          console.log('⚡ Supabase Realtime Event Received:', payload.eventType, payload);
          if (onEvent) {
            onEvent(payload);
          }
        }
      )
      .subscribe((status) => {
        console.log('⚡ Supabase Realtime Channel Status:', status);
      });

    return channel;
  } catch (error) {
    console.error('Failed to subscribe to Supabase realtime:', error);
    return null;
  }
};
