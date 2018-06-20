//
// Command: help
//
module.exports = function(controller) {

    controller.hears([/get[ \w]+temp[ ]*/i], 'direct_message,direct_mention', function(bot, message) {
        bot.reply(message, '26°C');
    });
}