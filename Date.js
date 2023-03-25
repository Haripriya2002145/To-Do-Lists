module.exports.getDate = function () {
    var today = new Date();
    //var currentDay = today.getDay();
    //currentDay=9;

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    return today.toLocaleDateString("en-US", options);
}