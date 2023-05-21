const { tgBotLogger } = require('./logger');

//telegram bot
const TelegramBot = require('node-telegram-bot-api');
const token = '6041726880:AAFwmy2N7zaF5G9_JnaofZvVH3OwVZXecaE';
const bot = new TelegramBot(token, { polling: true });



//Spectate

// Обробка команди /spectate


// // стікер
// const getStickerId = async (stickerSetName) => {
//   try {
//     const response = await bot.getStickerSet(stickerSetName);
//     const stickers = response.stickers;
//     if (stickers && stickers.length > 0) {
//       const stickerId = stickers[0].file_id;
//       return stickerId;
//     } else {
//       console.log('Стікери не знайдено');
//       return null;
//     }
//   } catch (err) {
//     console.log('Помилка при отриманні стікера', err);
//     return null;
//   }
// };

// // Виклик функції для отримання ідентифікатора стікера
// const getStickerIdAndPrint = async () => {
//   const stickerSetName = 'Erdoganishe';
//   const stickerId = await getStickerId(stickerSetName);
//   console.log('Ідентифікатор стікера:', stickerId);
// };

// Виклик асинхронної функції
//getStickerIdAndPrint();

// //аватар !!!!!!!!!!!!!!!!не працює
// const imagePath = path.join(__dirname,'public', 'img', 'avatars', 'tg_avatar.png');

// // Зчитуємо зображення у форматі base64
// const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

// // Викликаємо Telegram Bot API для зміни аватара бота
// bot.setChatPhoto(imageBase64).then((res) => {
//   console.log('Аватар бота змінено');
// }).catch((err) => {
//   console.log('Помилка при зміні аватара бота', err);
// });
// Пиздуй спати
// Обробка команди /start
// Обробка повідомлень


const botOn = () => bot.on('message', (message) => {
    const chatId = message.chat.id;

    if (message.text) {
        const messageText = message.text;

        // Обробка команди /help або /commands
        if (messageText.startsWith('/help') || messageText.startsWith('/commands')) {
            if (messageText === '/help' || messageText === '/commands') {
                const commandList = [
                    '/spectate - Переглянути активні ігри',
                    '/main - Отримати посилання на сайт'
                    // Додайте інші команди за потреби
                ];
                const gifPath = path.join(__dirname, 'public', 'img', 'gif4.mp4');

                // Відправка GIF-зображення як документу
                bot.sendDocument(chatId, gifPath)
                    .then(() => {
                        tgBotLogger('GIF-зображення відправлено', chatId);
                    })
                    .catch((err) => {
                        console.log('Помилка при відправленні GIF-зображення', err);
                    });

                const commandListText = commandList.join('\n');
                bot.sendMessage(chatId, commandListText)
                    .then(() => {
                        tgBotLogger('Список команд відправлено', chatId);
                    })
                    .catch((err) => {
                        console.log('Помилка при відправленні списку команд', err);
                    });
            }
        } else {
            // Обробка команди /start
            if (messageText.startsWith('/start')) {
                const gifPath = path.join(__dirname, 'public', 'img', 'gif2.mp4');

                // Відправка GIF-зображення як документу
                bot.sendDocument(chatId, gifPath)
                    .then(() => {
                        tgBotLogger('GIF-зображення відправлено', chatId);
                    })
                    .catch((err) => {
                        console.log('Помилка при відправленні GIF-зображення', err);
                    });

                const response = 'Вітаю! Бот запущено. Для перегляду команд використайте /help або /commands.';
                bot.sendMessage(chatId, response);
            } else if (messageText.startsWith('/spectate')) {
                // Обробка команди /spectate
                const activeGames = 2; // Кількість активних ігор (приклад)

                if (activeGames === 0) {
                    bot.sendMessage(chatId, 'Активних ігор немає, спробуйте пізніше');
                } else {
                    const gameMessages = [];
                    for (let i = 0; i < activeGames; i++) {
                        const gameId = i + 1;
                        const gameMessage = `Наразі активна гра ${gameId}`;
                        gameMessages.push(gameMessage);
                    }

                    const gifPath = path.join(__dirname, 'public', 'img', 'gif3.mp4');

                    // Відправка GIF-зображення як документу
                    bot.sendDocument(chatId, gifPath)
                        .then(() => {
                            tgBotLogger('GIF-зображення відправлено', chatId);
                        })
                        .catch((err) => {
                            console.log('Помилка при відправленні GIF-зображення', err);
                        });

                    const sendMessagePromises = gameMessages.map((gameMessage) =>
                        bot.sendMessage(chatId, gameMessage, {
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        {
                                            text: 'Отримати посилання',
                                            callback_data: 'get_link',
                                        },
                                        {
                                            text: '👍',
                                            callback_data: 'rate_up',
                                        },
                                        {
                                            text: '👎',
                                            callback_data: 'rate_down',
                                        },
                                    ],
                                ],
                            },
                        })
                    );

                    Promise.all(sendMessagePromises)
                        .then((sentMessages) => {
                            sentMessages.forEach((message) => {
                                const messageId = message.message_id;
                                bot.on('callback_query', (callbackQuery) => {
                                    const data = callbackQuery.data;
                                    if (data === 'get_link') {
                                        const gameId = message.text.match(/активна гра (\d+)/)[1];
                                        const link = `http://localhost:3000/game?${gameId}`;
                                        bot.answerCallbackQuery(callbackQuery.id, link);
                                    } else if (data === 'rate_up' || data === 'rate_down') {
                                        // Інкрементування значення оцінки гри
                                        // Ваша логіка для збереження оцінки гри
                                        bot.answerCallbackQuery(callbackQuery.id, 'Дякуємо за вашу оцінку!');
                                    }
                                });
                            });
                        })
                        .catch((err) => {
                            console.log('Помилка при відправленні повідомлень про активні ігри', err);
                        });
                }
            } else if (messageText.startsWith('/main')) {
                // Обробка команди /main
                const gifPath = path.join(__dirname, 'public', 'img', 'gif5.mp4');

                // Відправка GIF-зображення як документу
                bot.sendDocument(chatId, gifPath)
                    .then(() => {
                        tgBotLogger('GIF-зображення відправлено', chatId);
                    })
                    .catch((err) => {
                        console.log('Помилка при відправленні GIF-зображення', err);
                    });

                const response = 'Звичайно, ось посилання на наш сайт: [chess-arena.com](https://chess-arena.com)';
                bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
            } else {
                // Відправити стікер у відповідь
                bot.sendSticker(chatId, 'CAACAgIAAxUAAWRpw0rTHtPrD1Lph43vVIWKHso5AAK4HQACw5hRS486FBTmugxlLwQ')
                    .then(() => {
                        tgBotLogger('Стікер відправлено', chatId);
                    })
                    .catch((err) => {
                        console.log('Помилка при відправленні стікера', err);
                    });
            }
        }
    }
});

module.exports = botOn;