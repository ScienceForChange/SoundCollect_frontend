export class UserRecord {
  id: string;
  key?: string;
  value?: string;
  owner?: string;
  date?: number;
  programPatient?: string

  constructor(key?: string, value?: string, owner?: string, date?: number, programPatient?: string) {
    this.key = key;
    this.value = value;
    this.owner = owner;
    this.date = date;
    this.programPatient = programPatient;
  }
}
