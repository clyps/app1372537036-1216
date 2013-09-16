(function($)
    {
        $.populate=function(options) {
            //_____ Validation functions ____________
            function isEmail(email) { 
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }
            function isNorthAmericanPhone (phone) {
                var regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$ /;
                return regex.test(phone)
            }
            function isInternatioalPhone (phone) {
                var regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
                return regex.test(phone)
            }
            function isEPPPNumber (phone) {
                var regex = /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/;
                return regex.test(phone)
            }
            function isUrl(str) {
                var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
                    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
                    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
                    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
                    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
                    '(\#[-a-z\d_]*)?$','i'); // fragment locater
                if(!pattern.test(str)) {
                    return false;
                } else {
                    return true;
                }
            }
            //_____ Format functions ____________
            
            function formatPhone(phonenum) {
                var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
                if (regexObj.test(phonenum)) {
                    var parts = phonenum.match(regexObj);
                    var phone = "";
                    if (parts[1]) {
                        phone += "+1 (" + parts[1] + ") ";
                    }
                    phone += parts[2] + "-" + parts[3];
                    return phone;
                }
                else {
                    //invalid phone number
                    return phonenum;
                }
            }
            //_____ Core functions
            function evalData(el,value) {
                if (el.prop("tagName") == 'IMG') {
                    el.attr('src',value)
                } else{
                    el.html(value)
                }
            }
            var container = (options.container!=undefined)?options.container:''
            var prefix = (options.prefix!=undefined)?options.prefix:''
            if ( typeof options.item == 'object' && typeof container == 'string' && typeof prefix == 'string') {
                for( var j in options.item) {
                    evalData($(container+' '+prefix+j),options.item[j])
                }
            }
        };
    })(jQuery);
