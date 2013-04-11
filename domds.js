function parse(ar,cb) {
    var handlers = [];
    var create_handler = function(handler_info,handler_output) {
        var info = handler_info();
        handlers.push(function() {
            for(var i in info.on) {    
                $(i).bind(info.on[i], function(e) {
                    info.call(handler_output,this,e);                    
                });
            }
        });
    }
    var parser = function(ar){
        var node_name = ar[0];
        var node = $("<"+node_name+">")
        var node_attrs = ar[1];
        var attrs = {};
        if(typeof node_attrs == "object") {
            for(var i in node_attrs) {
                 if(typeof node_attrs[i] === "function") {                     
                     create_handler(node_attrs[i],(function(i){
                         return function(val) {                            
                            node.attr(i,val); 
                         }}(i)));
                 } else {
                      attrs[i] = node_attrs[i];   
                 }             
             }
        } else if(typeof node_attrs == "function") {
            create_handler(node_attrs,function(val) {
               if(typeof val == "string")
                   node.text(val)
               else
                   node.attr(val); 
            });
        }
         node.attr(attrs);    
         for(var i=2;i<ar.length;i++) {
              if(Array.isArray(ar[i]))
                  node.append(parser(ar[i]));      
              else if(typeof ar[i] == "string")
                  node.text(ar[i]);
              else if(typeof ar[i] == "function"){
                  create_handler(ar[i], function(val) {
                      if(typeof val == "string")
                          node.text(val)                   
                      else if(Array.isArray(val)) {
                          for(var z in val) {
                              parse(val[z],function(children) {
                                  node.append(children);                                                                                              
                              });                                                                                     
                          }
                      }
                  });
              }
         }
         return node;            
    }
    if(cb === undefined)
        $("body").append(parser(ar));
    else
        cb(parser(ar));
    for(var i in handlers) {
        handlers[i]();        
    }
}


var a = ["div", {},
         ["button",{"id" : "more", "disabled" : function(){
             return {
                 on : {
                     "#chk" : "click",
                     "load" : 0                     
                 },
                 call : function(ret) {
                     ret($("#chk:checked" ).length < 1);                     
                 }
             }
         }},"Click me"],
         ["input", {"type" : "checkbox", "id" : "chk", "checked" : true}],
         ["span", {}, "Enable button"],
         function() {
             return {
                 on : {
                     "#more" : "click"                     
                 },
                 call : function(ret,sender,event) {
                     ret([["br",{}], ["label",{},"Added"]]);                     
                 }
             }
         }
        ];
         
parse(a);
