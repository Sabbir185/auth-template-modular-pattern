export const USER_ROLE = {
    ADMIN: 'admin',
    EMPLOYEE: 'employee',
    SURGEON: 'surgeon',
    DOCTOR: 'doctor',
    COORDINATOR: 'coordinator',
    PATIENT: 'patient',
    NURSE: 'nurse',
    TECHNICAL_STAFF: 'technical_staff'
} as const;

export const USER_ROLE_ENUM = Object.values(USER_ROLE);