module.exports = function(controller, bot) {
    var normalizedPath = require("path").join(__dirname, "../../skills");
    require("fs").readdirSync(normalizedPath).forEach(function(file) {
        try {
            require("../../skills/" + file)(controller, bot);
        } catch (err) {
            if (err.code == "MODULE_NOT_FOUND") {
                if (file != "utils") {
                    console.log("could not load skill: " + file);
                }
            }
        }
    });
}