import type { history_record, user } from "./types/global";

// each list contains 10 records
export const SAMPLE_USERS: user[] = [
    {
        id: 1,
        name: 'John Doe',
        phone: '123-456-7890',
        gender: "male",
        address: '123 Main St, Springfield',
        dob: '1990-01-01'
    },
    {
        id: 2,
        name: 'Jane Smith',
        phone: '987-654-3210',
        gender: 'female',
        address: '456 Elm St, Springfield',
        dob: '1992-02-02'
    },
    {
        id: 3,
        name: 'Michael Johnson',
        phone: '555-123-4567',
        gender: 'male',
        address: '789 Oak Ave, Springfield',
        dob: '1988-03-15'
    },
    {
        id: 4,
        name: 'Emily Davis',
        phone: '555-987-6543',
        gender: 'female',
        address: '321 Pine St, Springfield',
        dob: '1995-07-22'
    },
    {
        id: 5,
        name: 'David Wilson',
        phone: '555-246-8135',
        gender: 'male',
        address: '654 Maple Dr, Springfield',
        dob: '1985-11-08'
    },
    {
        id: 6,
        name: 'Sarah Brown',
        phone: '555-369-2580',
        gender: 'female',
        address: '147 Cedar Ln, Springfield',
        dob: '1993-04-12'
    },
    {
        id: 7,
        name: 'Christopher Lee',
        phone: '555-159-7531',
        gender: 'male',
        address: '258 Birch Rd, Springfield',
        dob: '1987-09-30'
    },
    {
        id: 8,
        name: 'Amanda Taylor',
        phone: '555-753-9514',
        gender: 'female',
        address: '369 Walnut St, Springfield',
        dob: '1991-12-18'
    },
    {
        id: 9,
        name: 'James Anderson',
        phone: '555-852-4176',
        gender: 'male',
        address: '741 Cherry Ave, Springfield',
        dob: '1989-06-05'
    },
    {
        id: 10,
        name: 'Jessica Martinez',
        phone: '555-951-3624',
        gender: 'female',
        address: '852 Poplar Blvd, Springfield',
        dob: '1994-08-14'
    }


]

// type is of four types: 'clinical-presentation' | 'clinical-examination' | 'laboratory-investigation' | 'cause'
export const SAMPLE_HISTORY_RECORDS_FOR_ID_1: history_record[] = [
    {
        uid: 1,
        h_id: 1,
        date: new Date('2024-01-15'),
        time: '09:00',
        observations: [
            {
                id: 1,
                observation: 'Fever and headache',
                type: 'clinical-presentation',
                disease_id: 101,
                disease: 'Viral infection',
                selected: true
            },
            {
                id: 2,
                observation: 'Elevated temperature 101.5°F',
                type: 'clinical-examination',
                disease_id: 101,
                disease: 'Viral infection',
                selected: true
            }
        ]
    },
    {
        uid: 1,
        h_id: 2,
        date: new Date('2024-02-20'),
        time: '10:00',
        observations: [
            {
                id: 3,
                observation: 'Persistent cough and fatigue',
                type: 'clinical-presentation',
                disease_id: 102,
                disease: 'Upper respiratory infection',
                selected: true
            },
            {
                id: 4,
                observation: 'Chest X-ray normal',
                type: 'laboratory-investigation',
                disease_id: 102,
                disease: 'Upper respiratory infection',
                selected: false
            }
        ]
    },
    {
        uid: 1,
        h_id: 3,
        date: new Date('2024-03-10'),
        time: '11:00',
        observations: [
            {
                id: 5,
                observation: 'Chest pain and shortness of breath',
                type: 'clinical-presentation',
                disease_id: 103,
                disease: 'Asthma',
                selected: true
            },
            {
                id: 6,
                observation: 'Wheezing on auscultation',
                type: 'clinical-examination',
                disease_id: 103,
                disease: 'Asthma',
                selected: true
            },
            {
                id: 7,
                observation: 'Allergen exposure',
                type: 'cause',
                disease_id: 103,
                disease: 'Asthma',
                selected: true
            }
        ]
    },
    {
        uid: 1,
        h_id: 4,
        date: new Date('2024-04-05'),
        time: '12:00',
        observations: [
            {
                id: 8,
                observation: 'Abdominal pain and nausea',
                type: 'clinical-presentation',
                disease_id: 104,
                disease: 'Gastroenteritis',
                selected: true
            },
            {
                id: 9,
                observation: 'Dehydration signs',
                type: 'clinical-examination',
                disease_id: 104,
                disease: 'Gastroenteritis',
                selected: true
            }
        ]
    },
    {
        uid: 1,
        h_id: 5,
        date: new Date('2024-05-12'),
        time: '13:00',
        observations: [
            {
                id: 10,
                observation: 'Joint pain and stiffness',
                type: 'clinical-presentation',
                disease_id: 105,
                disease: 'Arthritis',
                selected: true
            },
            {
                id: 11,
                observation: 'Swollen joints',
                type: 'clinical-examination',
                disease_id: 105,
                disease: 'Arthritis',
                selected: true
            },
            {
                id: 12,
                observation: 'Elevated ESR',
                type: 'laboratory-investigation',
                disease_id: 105,
                disease: 'Arthritis',
                selected: true
            }
        ]
    },
    {
        uid: 1,
        h_id: 6,
        date: new Date('2024-06-18'),
        time: '14:00',
        observations: [
            {
                id: 13,
                observation: 'Skin rash and itching',
                type: 'clinical-presentation',
                disease_id: 106,
                disease: 'Allergic dermatitis',
                selected: true
            },
            {
                id: 14,
                observation: 'Red inflamed skin patches',
                type: 'clinical-examination',
                disease_id: 106,
                disease: 'Allergic dermatitis',
                selected: true
            },
            {
                id: 15,
                observation: 'Contact with allergen',
                type: 'cause',
                disease_id: 106,
                disease: 'Allergic dermatitis',
                selected: true
            }
        ]
    },
    {
        uid: 1,
        h_id: 7,
        date: new Date('2024-07-25'),
        time: '15:00',
        observations: [
            {
                id: 16,
                observation: 'Dizziness and lightheadedness',
                type: 'clinical-presentation',
                disease_id: 107,
                disease: 'Hypotension',
                selected: true
            },
            {
                id: 17,
                observation: 'Blood pressure 90/60 mmHg',
                type: 'clinical-examination',
                disease_id: 107,
                disease: 'Hypotension',
                selected: true
            }
        ]
    },
    {
        uid: 1,
        h_id: 8,
        date: new Date('2024-08-30'),
        time: '16:00',
        observations: [
            {
                id: 18,
                observation: 'Frequent urination and thirst',
                type: 'clinical-presentation',
                disease_id: 108,
                disease: 'Diabetes mellitus',
                selected: true
            },
            {
                id: 19,
                observation: 'Blood glucose 180 mg/dL',
                type: 'laboratory-investigation',
                disease_id: 108,
                disease: 'Diabetes mellitus',
                selected: true
            },
            {
                id: 20,
                observation: 'Family history of diabetes',
                type: 'cause',
                disease_id: 108,
                disease: 'Diabetes mellitus',
                selected: true
            }
        ]
    },
    {
        uid: 1,
        h_id: 9,
        date: new Date('2024-09-14'),
        time: '17:00',
        observations: [
            {
                id: 21,
                observation: 'Insomnia and anxiety',
                type: 'clinical-presentation',
                disease_id: 109,
                disease: 'Anxiety disorder',
                selected: true
            },
            {
                id: 22,
                observation: 'Increased heart rate',
                type: 'clinical-examination',
                disease_id: 109,
                disease: 'Anxiety disorder',
                selected: true
            },
            {
                id: 23,
                observation: 'Stressful life event',
                type: 'cause',
                disease_id: 109,
                disease: 'Anxiety disorder',
                selected: true
            }
        ]
    },
    {
        uid: 1,
        h_id: 10,
        date: new Date('2024-10-22'),
        time: '18:00',
        observations: [
            {
                id: 24,
                observation: 'Lower back pain',
                type: 'clinical-presentation',
                disease_id: 110,
                disease: 'Lumbar strain',
                selected: true
            },
            {
                id: 25,
                observation: 'Limited range of motion',
                type: 'clinical-examination',
                disease_id: 110,
                disease: 'Lumbar strain',
                selected: true
            },
            {
                id: 26,
                observation: 'Heavy lifting activity',
                type: 'cause',
                disease_id: 110,
                disease: 'Lumbar strain',
                selected: true
            }
        ]
    }
];

export const SAMPLE_HISTORY_RECORDS_FOR_ID_2: history_record[] = [
    {
        uid: 2,
        h_id: 1,
        date: new Date('2024-01-10'),
        time: '09:30',
        observations: [
            {
                id: 27,
                observation: 'Sore throat and mild fever',
                type: 'clinical-presentation',
                disease_id: 201,
                disease: 'Pharyngitis',
                selected: true
            },
            {
                id: 28,
                observation: 'Red, swollen throat',
                type: 'clinical-examination',
                disease_id: 201,
                disease: 'Pharyngitis',
                selected: true
            }
        ]
    },
    {
        uid: 2,
        h_id: 2,
        date: new Date('2024-02-14'),
        time: '10:30',
        observations: [
            {
                id: 29,
                observation: 'Abdominal cramps and diarrhea',
                type: 'clinical-presentation',
                disease_id: 202,
                disease: 'Food poisoning',
                selected: true
            },
            {
                id: 30,
                observation: 'Positive stool culture',
                type: 'laboratory-investigation',
                disease_id: 202,
                disease: 'Food poisoning',
                selected: true
            }
        ]
    },
    {
        uid: 2,
        h_id: 3,
        date: new Date('2024-03-12'),
        time: '11:30',
        observations: [
            {
                id: 31,
                observation: 'Frequent urination and burning sensation',
                type: 'clinical-presentation',
                disease_id: 203,
                disease: 'Urinary tract infection',
                selected: true
            },
            {
                id: 32,
                observation: 'Urine analysis: leukocytes present',
                type: 'laboratory-investigation',
                disease_id: 203,
                disease: 'Urinary tract infection',
                selected: true
            }
        ]
    },
    {
        uid: 2,
        h_id: 4,
        date: new Date('2024-04-18'),
        time: '12:30',
        observations: [
            {
                id: 33,
                observation: 'Sudden onset of rash',
                type: 'clinical-presentation',
                disease_id: 204,
                disease: 'Measles',
                selected: true
            },
            {
                id: 34,
                observation: 'Koplik spots in mouth',
                type: 'clinical-examination',
                disease_id: 204,
                disease: 'Measles',
                selected: true
            }
        ]
    },
    {
        uid: 2,
        h_id: 5,
        date: new Date('2024-05-20'),
        time: '13:30',
        observations: [
            {
                id: 35,
                observation: 'Shortness of breath on exertion',
                type: 'clinical-presentation',
                disease_id: 205,
                disease: 'Mild asthma',
                selected: true
            },
            {
                id: 36,
                observation: 'Wheezing on auscultation',
                type: 'clinical-examination',
                disease_id: 205,
                disease: 'Mild asthma',
                selected: true
            }
        ]
    },
    {
        uid: 2,
        h_id: 6,
        date: new Date('2024-06-15'),
        time: '14:30',
        observations: [
            {
                id: 37,
                observation: 'Painful urination and lower abdominal pain',
                type: 'clinical-presentation',
                disease_id: 206,
                disease: 'Cystitis',
                selected: true
            },
            {
                id: 38,
                observation: 'Urine culture: E. coli detected',
                type: 'laboratory-investigation',
                disease_id: 206,
                disease: 'Cystitis',
                selected: true
            }
        ]
    },
    {
        uid: 2,
        h_id: 7,
        date: new Date('2024-07-19'),
        time: '15:30',
        observations: [
            {
                id: 39,
                observation: 'Sudden weight loss and increased thirst',
                type: 'clinical-presentation',
                disease_id: 207,
                disease: 'Type 1 Diabetes',
                selected: true
            },
            {
                id: 40,
                observation: 'Blood glucose 220 mg/dL',
                type: 'laboratory-investigation',
                disease_id: 207,
                disease: 'Type 1 Diabetes',
                selected: true
            }
        ]
    },
    {
        uid: 2,
        h_id: 8,
        date: new Date('2024-08-22'),
        time: '16:30',
        observations: [
            {
                id: 41,
                observation: 'Pain and swelling in right ankle',
                type: 'clinical-presentation',
                disease_id: 208,
                disease: 'Sprain',
                selected: true
            },
            {
                id: 42,
                observation: 'Limited range of motion',
                type: 'clinical-examination',
                disease_id: 208,
                disease: 'Sprain',
                selected: true
            }
        ]
    },
    {
        uid: 2,
        h_id: 9,
        date: new Date('2024-09-16'),
        time: '17:30',
        observations: [
            {
                id: 43,
                observation: 'Episodes of sneezing and runny nose',
                type: 'clinical-presentation',
                disease_id: 209,
                disease: 'Allergic rhinitis',
                selected: true
            },
            {
                id: 44,
                observation: 'Pale, boggy nasal mucosa',
                type: 'clinical-examination',
                disease_id: 209,
                disease: 'Allergic rhinitis',
                selected: true
            }
        ]
    },
    {
        uid: 2,
        h_id: 10,
        date: new Date('2024-10-21'),
        time: '18:30',
        observations: [
            {
                id: 45,
                observation: 'Mild chest pain and palpitations',
                type: 'clinical-presentation',
                disease_id: 210,
                disease: 'Mild arrhythmia',
                selected: true
            },
            {
                id: 46,
                observation: 'ECG: occasional premature beats',
                type: 'laboratory-investigation',
                disease_id: 210,
                disease: 'Mild arrhythmia',
                selected: true
            }
        ]
    }
];

