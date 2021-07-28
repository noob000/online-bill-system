export interface MainData{
    date:string;
    catagory:string;
    cata:string;
    amount:number;
    note:string;
    dateObject:string;
}

export interface YearSortedData {
    year:number;
    data:MainData []
}
export interface MainDataWithMs{
    date:string;
    catagory:string;
    cata:string;
    amount:number;
    note:string;
    dateObject:string;
    ms:number;
}