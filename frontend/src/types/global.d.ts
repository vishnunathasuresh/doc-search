export interface user {
    id: number
    name: string;
    phone: string;
    gender: string;
    address: string;
    dob: string;
}

export interface history_record {
    uid: number;//user id
    h_id: number;
    date: Date;
    time: string;
    observations: Observation[]
}

export interface Observation {
    id: number;
    observation: string;
    type: string;
    disease_id: number;
    disease: string;
    selected: boolean;
}


