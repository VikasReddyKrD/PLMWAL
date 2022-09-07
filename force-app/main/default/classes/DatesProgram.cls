public class DatesProgram {
    public static Date Dt(){
        /*Date myDate1 = Date.newInstance(2022, 7, 35);
Date newDate = mydate1.addDays(2);
system.debug('old date--- ' +myDate1);
system.debug('new date----' +newDate);
string mydate2 = mydate1.format();
system.debug(mydate2);
date myDate = date.newInstance(1990, 11, 21);
date newDate1 = myDate.addMonths(3);
system.debug('old month--- ' +myDate);
system.debug('new month--- ' +newDate1);
date myDate3= Date.today();
Date cmprDate =Date.newInstance(2022, 7, 12);
boolean cmprDate1 = myDate3.isSameDay(cmprDate);
system.debug(cmprDate1);
Date firstdate = Date.newInstance(2022, 07, 14);
Date seconddate = Date.newInstance(1997, 02, 05);
Integer datebetween = seconddate.daysbetween(firstdate);
system.debug(datebetween);*/
        
        
        
        /*string year = '2008';
string month = '10';
string day = '5';
string hour = '12';
string minute = '20';
string second = '20';*/
        string year='2022', month='07', day='14', hour='12', minute='20', second='20';
        string stringDate = year + '-' + month
            + '-' + day + ' ' + hour + ':' + 
            minute + ':' + second;
        
        Date myDate = date.valueOf(stringDate);
        //system.debug(mydate);
        return myDate;
        
    }
}