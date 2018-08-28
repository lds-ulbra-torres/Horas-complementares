export class User{
    id: number;
    name: string;
    email: string;
    password: string;
    type: number;
    cgu: string;
    matricula: string;
    student: {
        cgu: string;
        matricula: string;
    }
}