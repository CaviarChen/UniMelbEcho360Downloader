// string format from https://stackoverflow.com/questions/25227119/javascript-strings-format-is-not-defined
String.prototype.format = function () {
        var args = [].slice.call(arguments);
        return this.replace(/(\{\d+\})/g, function (a){
            return args[+(a.substr(1,a.length-2))||0];
        });
};
// code from https://stackoverflow.com/questions/12166753/how-to-get-child-element-by-class-name
function findClass(element, className) {
        var foundElement = null, found;
        function recurse(element, className, found) {
            for (var i = 0; i < element.childNodes.length && !found; i++) {
                var el = element.childNodes[i];
                var classes = el.className != undefined? el.className.split(" ") : [];
                for (var j = 0, jl = classes.length; j < jl; j++) {
                    if (classes[j] == className) {
                        found = true;
                        foundElement = element.childNodes[i];
                        break;
                    }
                }
                if(found)
                    break;
                recurse(element.childNodes[i], className, found);
            }
        }
        recurse(element, className, false);
        return foundElement;
    }

console.log("===========================");
console.log("start");

var rec_data = [];

var rec_list = document.getElementById("echoes-list").childNodes;

// starting from the first recording
for(var i=rec_list.length-1; i>=0; i--) {
    var img_url = findClass(rec_list[i], "thumbnail").getAttribute('src');
    var rec_uuid = img_url.split("/")[6];
    var d1,d2;
    d1 = img_url.split("/")[4];
    d2 = img_url.split("/")[5];
    var time = findClass(rec_list[i], "echo-date").innerHTML;

    var url = "https://download.lecture.unimelb.edu.au/{0}/audio-vga.m4v?download".format(d1 + "/" + d2 + "/" + rec_uuid);

    rec_data.push({"url": url, "time": time});

}

console.log(rec_data.length + " recordings in total.");

// download json
document.body.innerHTML += "<a id='download_rec'></a>";


var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rec_data));
document.getElementById("download_rec").setAttribute("download", "data.json");
document.getElementById("download_rec").setAttribute("href", dataStr);
document.getElementById("download_rec").click();
