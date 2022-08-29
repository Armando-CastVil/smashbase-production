export default function urlToSlug(url:string)
{
    let slug:string="";
    //remove hhtps or www
    if(url.substring(0,5)=="https")
    {
        slug=url.substring(21,url.length)
    }
    else if(url.substring(0,3)=="www")
    {
      slug=url.substring(13,url.length)
    }
  else
    {
      if(url.charAt(0)=='s')
      {
        slug=url.substring(9,url.length)
      }
      
    }

  //url does not have https://www.start.gg/ at this point

  //check if there's anything else after the slug
  let counter=0
  for(let i=0;i<slug.length;i++)
    {
      if(slug.charAt(i)=="/")
      {
        counter++;
      }
    }
  //if it only has 3 "/", then slug is already correct
  if(counter==3)
  {
    return slug
  }
  else
  {
    counter=0;
    for(let i=0;i<url.length;i++)
    {
      if(slug.charAt(i)=="/")
      {
        counter++;

        if (counter ==4)
        {
          slug=slug.substring(0,i)
          return slug
        }
      }
    }
    
  }
  
}