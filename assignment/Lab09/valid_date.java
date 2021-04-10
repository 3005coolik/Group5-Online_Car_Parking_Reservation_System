package sen_lab;

import java.io.*;
import java.util.*; 

class valid_date
{
    static boolean isLeap(int year)
    {
        return (((year % 4 == 0) &&
                 (year % 100 != 0)) ||
                 (year % 400 == 0));
    }
 
    static boolean isValidDate(int d, int m, int y)
    {
        if (y > 2015 || y < 1900)
            return false;
        if (m < 1 || m > 12)
            return false;
        if (d < 1 || d > 31)
            return false;
 
        if (m == 2)
        {
            if (isLeap(y))
                return (d <= 29);
            else
                return (d <= 28);
        }
 
        if (m == 4 || m == 6 ||
            m == 9 || m == 11)
            return (d <= 30);
 
        return true;
    }
 
    public static void main(String args[])
    {
    	Scanner sc= new Scanner(System.in);   
    	System.out.print("Enter day- ");  
    	int a= sc.nextInt();  
    	System.out.print("Enter month- ");  
    	int b= sc.nextInt();  
    	System.out.print("Enter year- ");  
    	int c= sc.nextInt(); 
    	
        if (isValidDate(a, b, c))
        { System.out.println("Valid");
        String modifiedFromDate = String.valueOf(a) +'/'+String.valueOf(b)+'/'+String.valueOf(c);
        int MILLIS_IN_DAY = 1000 * 60 * 60 * 24;
        
        java.text.SimpleDateFormat dateFormat =
            	new java.text.SimpleDateFormat("dd/MM/yy");
          java.util.Date dateSelectedFrom = null;
          java.util.Date dateNextDate = null;
          java.util.Date datePreviousDate = null;

          // convert date present in the String to java.util.Date.
          try
          {
    	  dateSelectedFrom = dateFormat.parse(modifiedFromDate);
          }
          catch(Exception e)
          {
    	  e.printStackTrace();
          }
          String nextDate =
        	      dateFormat.format(dateSelectedFrom.getTime() - MILLIS_IN_DAY);
          try
          {
             // dateNextDate = dateFormat.parse(nextDate);
              System.out.println("Prev day's date: "+nextDate);
          }
          catch(Exception e)
          {
              e.printStackTrace();
          }
        }
        
        else
            System.out.println("Invalid");

    }
}
