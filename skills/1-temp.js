//
// Command: help
//
module.exports = function(controller) {

    controller.hears([/^temp$/], 'direct_message,direct_mention', function(bot, message) {
        bot.reply(message, '26°C');
    });
}