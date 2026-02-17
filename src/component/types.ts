export type Speaker = {
  name: string;
  speaker_uuid: string;
  styles: {
    id: number;
    name: string;
  }[];
  version?: string;
};
