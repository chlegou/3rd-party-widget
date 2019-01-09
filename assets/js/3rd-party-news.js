
/** Net - XMLHTTP Interface - bfults@gmail.com - 2006-08-29                 **
 ** Code licensed under Creative Commons Attribution-ShareAlike License     **
 ** http://creativecommons.org/licenses/by-sa/2.5/                          **/

/** Net asynchronous request library
 * link: http://xkr.us/code/javascript/Net/ **/
 


 /** Net - XMLHTTP Interface - bfults@gmail.com - 2006-08-29                 **
 ** Code licensed under Creative Commons Attribution-ShareAlike License     **
 ** http://creativecommons.org/licenses/by-sa/2.5/                          **/

/** Net asynchronous request library **/
Net = function()
{
  this.Request = Net._createRequestObject();
}

/** Net.get({
   url: [string] -- URL to make the request to,
   vars: [string|object] (optional) -- object or string of querystring vars,
   onsuccess: [function] -- function reference to call on success,
   onerror: [function] (optional) -- function reference to call on error
 }) -- make an HTTP GET request
 ** Returns true on successful request dispatch, false on error.
 **/
Net.get = function(oArgs)
{
  if (oArgs.url && oArgs.onsuccess)
  {
    if (typeof oArgs.vars == "object")
    {
      oArgs.vars = '?'+ Net._serializeObject(oArgs.vars);
    }
    else if (typeof oArgs.vars == "string"
             && oArgs.vars.length > 0
             && !/\?/.test(oArgs.vars))
    {
      oArgs.vars = '?' + oArgs.vars;
    }
    if (!oArgs.vars) oArgs.vars = '';
    oArgs.onerror = oArgs.onerror || Net._fnErrorDefault;
    try {
      var N = new Net();
      N.Request.open("GET", oArgs.url + oArgs.vars, true);
      N._setCallback(oArgs.onsuccess, oArgs.onerror, oArgs.extras);
      N.Request.send('');
    }
    catch (e)
    {
      oArgs.onerror("initialization");
      return false;
    }
  }
  else
  {
    return false;
  }
  return true;
}

/** Net.post({
   url: [string] -- URL to make the request to,
   vars: [string|object] (optional) -- object or string of post vars,
   onsuccess: [function] -- function reference to call on success,
   onerror: [function] (optional) -- function reference to call on error
 }) -- make an HTTP POST request
 ** Returns true on successful request dispatch, false on error.
 **/
Net.post = function(oArgs)
{
  if (oArgs.url && oArgs.onsuccess)
  {
    if (typeof oArgs.vars == "object")
    {
      oArgs.vars = Net._serializeObject(oArgs.vars);
    }
    if (!oArgs.vars) oArgs.vars = '';
    oArgs.onerror = oArgs.onerror || Net._fnErrorDefault;
    try {
      var N = new Net();
      N.Request.open("POST", oArgs.url, true);
      N._setCallback(oArgs.onsuccess, oArgs.onerror);
      N.Request.setRequestHeader("Method", "POST "+oArgs.url+" HTTP/1.1");
      N.Request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      N.Request.send(oArgs.vars);
    }
    catch (e)
    {
      oArgs.onerror("initialization");
      return false;
    }
  }
  else
  {
    return false;
  }
  return true;
}

// a default error function showing the structure (does nothing)
Net._fnErrorDefault = function(sType, Request)
{
  switch (sType)
  {
    case "timeout":
    // it was a timeout (Request undefined)
    alert("XMLHTTP timeout.");
    break;

    case "initialization":
    // initialization error (Request undefined)
    alert("XMLHTTP initialization failure.")
    break;

    default:
    // other error (HTTP status, etc.)
    alert("XMLHTTP error: ["+ Request.status +"] "+ Request.statusText);
  }
}

// a helper function to serialize an object
Net._serializeObject = function(oFrom)
{
  var aTemp = [];
  for (var i in oFrom)
  {
    aTemp.push(encodeURIComponent(i) +"="+ encodeURIComponent(oFrom[i]));
  }
  return aTemp.join('&');
}

/** Net._setCallback(fnCallback, fnError)
 ** Attaches (and wraps) a request object with a user-defined callback.
 ** Optional fnError: call upon erroneous HTTP status code or timeout.
 **/

Net.prototype._setCallback = function(fnCallback, fnError, extras)
{
  this.Request.onreadystatechange = (function (oNet)
  {
    return function()
    {
      if (oNet.Request.readyState == 4)
      {
        window.clearTimeout(oNet.timeout);
        
        try {
          if (oNet.Request.status === undefined
            || oNet.Request.status === 0
            || (oNet.Request.status >= 200 && oNet.Request.status < 300)
            || oNet.Request.status == 304)
          {
              
            fnCallback(oNet.Request , extras);
          }
          else
          {
            fnError("other", oNet.Request);
          }
        } catch (e) {
          fnError("other", oNet.Request);
        }
      }
    }
  })(this);

  this.timeout = window.setTimeout((function(oNet) {
    return function() {
      oNet.Request.onreadystatechange = function() {};
      oNet.Request = null;
      fnError("timeout"); }})(this), 20000);
}



/** Net._createRequestObject()
 ** Creates and returns an XMLHTTP element or null on failure.
 **/
Net._createRequestObject = function()
{
  var xmlhttp;
  if (window.XMLHttpRequest) { xmlhttp = new XMLHttpRequest(); }
  else if (window.ActiveXObject) {
    try { xmlhttp = new ActiveXObject("Msxml2.XMLHTTP"); }
    catch (e) { try { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); }
    catch (e) { xmlhttp = null; }}
  }
  return xmlhttp;
}
/** End Net asynchronous request library */





















/** 3rd Party News Starts Here */

NewsThirdParty = function (configs) {
    /**configs: {url, index, size} */
    this.net = Net;
    
    this.configs = !!configs ? configs : {};
    this.configs.selector = !!configs.selector ? configs.selector : null;
    this.configs.classes = !!configs.classes ? configs.classes : '';
    this.configs.url = !!configs.url ? configs.url : '';
    this.configs.index = !!configs.index ? configs.index : 0;
    this.configs.remoteCss = !!configs.remoteCss ? configs.remoteCss : [];
    this.configs.remoteJs = !!configs.remoteJs ? configs.remoteJs : [];

    this._init();
    
}

NewsThirdParty.prototype._init = function () { 


    // load CSS & Js scripts
    this.configs.remoteCss.forEach(element => this._loadJsCssFile(element, "css"));
    this.configs.remoteJs.forEach(element => this._loadJsCssFile(element, "js"));
    
    
    


    container = document.querySelector(this.configs.selector);
    container.classList.add("container");
    
    divRow = document.createElement('div');
    divRow.classList.add("row");
    container.appendChild(divRow);

    divControl = document.createElement('div');
    divControl.classList.add("control");
    container.appendChild(divControl);
    divControlContent = _loadMoreTemplate.replace("%GRID_ICON%", _GRID_SVG);
    divControl.innerHTML = divControlContent;

    document.querySelector(this.configs.selector + " .third-party-news-load-more" ).addEventListener("click", function(){this._loadMoreFeeds();}.bind(this));


    //handling initial control
    document.querySelector(this.configs.selector + " .third-party-news-load-more" ).classList.add("hidden");
    document.querySelector(this.configs.selector + " .news-waiting-load" ).classList.remove("hidden");
    document.querySelector(this.configs.selector + " .news-completed" ).classList.add("hidden");

    

};


NewsThirdParty.prototype._loadJsCssFile =  function (filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else{
        if (filetype=="css"){ //if filename is an external CSS file
            var fileref=document.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", filename)
        }
    }

    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}



NewsThirdParty.prototype._fnWhenDone = function (R , extras) { 
    var newsArray = JSON.parse(R.responseText);
    // console.log(newsArray); 
    // console.log(extras); 
    if(this.selector === null){
        return;
    }
    // console.log("newsArray"); 

    // start fake pagination!! should be ommitted in prod
    maxSize = newsArray.length;

    start = Math.min(extras.index * extras.size, maxSize);
    limit = Math.min((extras.index + 1) * extras.size , maxSize);
    newsArray = newsArray.slice(start, limit);
    // end fake pagination

    var newsHtml = newsArray.map(element => _rederPostHTML(element, extras));



    divRow =  document.querySelector(extras.selector + " .row" );
    divRow.insertAdjacentHTML('beforeend', newsHtml.join(''));

    //handling control: show button, hide loader, or show no more available
    if(newsHtml.length > 0){
        document.querySelector(extras.selector + " .third-party-news-load-more" ).classList.remove("hidden");
        document.querySelector(extras.selector + " .news-waiting-load" ).classList.add("hidden");
        document.querySelector(extras.selector + " .news-completed" ).classList.add("hidden");
    }else{
        document.querySelector(extras.selector + " .third-party-news-load-more" ).classList.add("hidden");
        document.querySelector(extras.selector + " .news-waiting-load" ).classList.add("hidden");
        document.querySelector(extras.selector + " .news-completed" ).classList.remove("hidden");
    }
    

};
NewsThirdParty.prototype._fnWhenError = function (sType, R) { console.log(R); console.log("Error! (" + sType + "): " + (R.statusText || '')); };



_rederPostHTML = function (singlePostJson, extras) { 
    // console.log(extras); 
    var htmlPost = _newsPostTemplate;
    htmlPost = htmlPost.replace("%POST_CLASSES%", extras.classes);
    htmlPost = htmlPost.replace("%TITLE%", singlePostJson.title);
    htmlPost = htmlPost.replace("%DESCRIPTION%", singlePostJson.description);
    htmlPost = htmlPost.replace("%THUMBNAIL%", singlePostJson.thumbnail);
    htmlPost = htmlPost.replace("%LINK%", singlePostJson.link);
    htmlPost = htmlPost.replace("%GO_TO_LINK_ICON%", _LEFT_ARROW_SVG);

    return htmlPost;
};



NewsThirdParty.prototype.getNewsFeed = function () { 

    Net.get({ url: this.configs.url, vars: {index: this.configs.index, size: this.configs.size}, onsuccess: this._fnWhenDone, onerror: this._fnWhenError, extras: this.configs });

};
NewsThirdParty.prototype._loadMoreFeeds = function () { 
    //handling initial control
    document.querySelector(this.configs.selector + " .third-party-news-load-more" ).classList.add("hidden");
    document.querySelector(this.configs.selector + " .news-waiting-load" ).classList.remove("hidden");
    document.querySelector(this.configs.selector + " .news-completed" ).classList.add("hidden");


    Net.get({ url: this.configs.url, vars: {index: ++this.configs.index, size: this.configs.size}, onsuccess: this._fnWhenDone, onerror: this._fnWhenError, extras: this.configs });

};


_newsPostTemplate = `
    <!--begin post item -->
    <div class="news-post %POST_CLASSES%">
    <a href="%LINK%" target="_blank" rel="noopener noreferrer">
        <div class="post-box">
            <img class="post-image" src="%THUMBNAIL%" alt="post-image">
    
            <div class="post-content">
                <div class="post-title">%TITLE%</div>
                <div class="post-description">%DESCRIPTION%</div>
                <div class="post-redirect layout-row layout-align-center-center">
                    <div style="margin: 10px 0px;">
                        %GO_TO_LINK_ICON%
                    </div>
    
    
                </div>
            </div>
    
        </div>
    </a>
    </div>
    <!--end post item -->
      `;

_loadMoreTemplate = `
<div class="post-redirect layout-row layout-align-center-center">
    <div class="third-party-news-load-more">
    <span class="">Read More</span>
    <span style="margin-left:10px;">%GRID_ICON%</span>
    </div>
    <div class="news-waiting-load hidden">
        <img class="post-image" src="//media.giphy.com/media/8RyJliVfFM6ac/giphy.gif" alt="control">
    </div>
    <div class="news-completed hidden">
        <span class="">No More News Available!</span>
    </div>
    
    
</div>

`;



_LEFT_ARROW_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50" version="1.1" style="width: 75px; height: 75px">
<g fill="#fff" >
<path style=" " d="M 14.988281 3.992188 C 14.582031 3.992188 14.21875 4.238281 14.0625 4.613281 C 13.910156 4.992188 14 5.421875 14.292969 5.707031 L 33.585938 25 L 14.292969 44.292969 C 14.03125 44.542969 13.925781 44.917969 14.019531 45.265625 C 14.109375 45.617188 14.382813 45.890625 14.734375 45.980469 C 15.082031 46.074219 15.457031 45.96875 15.707031 45.707031 L 35.707031 25.707031 C 36.097656 25.316406 36.097656 24.683594 35.707031 24.292969 L 15.707031 4.292969 C 15.519531 4.097656 15.261719 3.992188 14.988281 3.992188 Z "></path>
</g>
</svg>
`;


_GRID_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="8 8 32 32" version="1.1" style="width: 30px;height: 30px; vertical-align: middle;">
<g transform="scale(2)" id="surface1">
<path style=" " d="M 4 4 L 4 8 L 8 8 L 8 4 Z M 10 4 L 10 8 L 14 8 L 14 4 Z M 16 4 L 16 8 L 20 8 L 20 4 Z M 4 10 L 4 14 L 8 14 L 8 10 Z M 10 10 L 10 14 L 14 14 L 14 10 Z M 16 10 L 16 14 L 20 14 L 20 10 Z M 4 16 L 4 20 L 8 20 L 8 16 Z M 10 16 L 10 20 L 14 20 L 14 16 Z M 16 16 L 16 20 L 20 20 L 20 16 Z "/>
</g>
</svg>
`;






