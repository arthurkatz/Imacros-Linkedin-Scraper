var macro, retcode, url="", pos=1, stop=false, counter=1,resultCount=1;

macro_googlesearch = "CODE:";
macro_googlesearch += "TAB T=1\n";
macro_googlesearch += "URL GOTO=google.fr\n";
macro_googlesearch += "SET !DATASOURCE google<sp>keywords.txt\n";
macro_googlesearch += "SET !LOOP 1\n";
macro_googlesearch += "TAG POS=1 TYPE=INPUT ATTR=id:gbqfq CONTENT={{!COL1}}\n";
macro_googlesearch += "TAG POS=1 TYPE=span ATTR=id:gbqfsa\n";



macro_linkedinLogin = "CODE:";
macro_linkedinLogin += "TAB T=1\n";
macro_linkedinLogin += "URL GOTO=https://www.linkedin.com/uas/login?goback=&trk=hb_signin\n";
macro_linkedinLogin += "SET !DATASOURCE_DELIMITER ;\n";
macro_linkedinLogin += "SET !DATASOURCE linkedin<sp>account.txt\n";
macro_linkedinLogin += "SET !LOOP 1\n";
macro_linkedinLogin += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:login ATTR=ID:session_key-login CONTENT={{!COL1}}\n";
macro_linkedinLogin += "SET !ENCRYPTION NO\n";
macro_linkedinLogin += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ID:login ATTR=ID:session_password-login CONTENT={{!COL2}}\n";
macro_linkedinLogin += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:login ATTR=ID:btn-primary\n";
macro_linkedinLogin += "SET !TIMEOUT_PAGE 120\n";
macro_linkedinLogin += "WAIT SECONDS=5\n";

main:{

retcode = iimPlay(macro_linkedinLogin);
if (hasError(retcode,"LinkedIn login script has failed.")) {break main;}

retcode = iimPlay(macro_googlesearch);
if (hasError(retcode,"Google search script has failed.")) {break main;}


   
   

   
   while(!stop)
   {
      macro = "CODE:";
      macro += "SET !EXTRACT NULL\n"
      macro += "SET !TIMEOUT_STEP 2\n"
      macro += "TAG POS="+counter+" TYPE=h3 ATTR=class:r EXTRACT=TXT\n"   //TITLE EXTRACT
      macro += "SET !VAR0 {{!EXTRACT}}\n"      
      macro += "SET !EXTRACT NULL\n"            
      macro += "TAG POS=1 TYPE=a ATTR=onmousedown:return<sp>rwt(this,'','','','"+resultCount+"'* EXTRACT=href\n"//NEW TAB URL EXTRACT
      macro += "TAB OPEN\n"
      macro += "TAB T=2\n"    
      macro += "URL GOTO={{!EXTRACT}}\n"
      macro += "SET !EXTRACT NULL\n"
      macro += "SET !EXTRACT {{!VAR0}}\n"
      macro += "TAG POS=1 TYPE=a ATTR=class:view-public-profile EXTRACT=href\n";
      macro += "TAG POS=1 TYPE=p ATTR=class:title EXTRACT=txt\n";
      macro += "TAG POS=1 TYPE=a ATTR=dir:auto EXTRACT=TXT\n";
      macro += "TAG POS=1 TYPE=span ATTR=class:locality EXTRACT=TXT\n";      
      macro += "TAG POS=1 TYPE=img ATTR=href:*media.licdn* EXTRACT=href\n";
      macro += "SAVEAS TYPE=EXTRACT FOLDER=* FILE=scraped.CSV\n"
      macro += "TAB CLOSE\n"
      macro += "TAB T =1\n"

      
      retcode = iimPlay(macro);
      counter++;
      resultCount++;      
      if (hasError(retcode,"Scraping Failed.")) {break main;}  
      
      if (counter > 10){
         macro = "CODE: ";
         macro += "TAG POS=1 TYPE=a ATTR=id:pnnext\n";
         retcode = iimPlay(macro);
         counter = 1;

      }      
   }
      


}






function hasError(p_retcode,p_errormessage){
   if (p_retcode == -101){return 1}
   if (p_retcode != 1)               // an error has occured
   {
    errtext = iimGetLastError();
    alert(p_errormessage + "\n Error Code: "+p_retcode+": "+errtext);
    return 1
    //break main;     
   }
   return 0
}