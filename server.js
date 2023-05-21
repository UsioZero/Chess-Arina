require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const { logger } = require('./middleware/logger');
const fs = require('fs');

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
bot.on('message', (message) => {
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
            console.log('GIF-зображення відправлено');
          })
          .catch((err) => {
            console.log('Помилка при відправленні GIF-зображення', err);
          });

        const commandListText = commandList.join('\n');
        bot.sendMessage(chatId, commandListText)
          .then(() => {
            console.log('Список команд відправлено');
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
            console.log('GIF-зображення відправлено');
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
              console.log('GIF-зображення відправлено');
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
            console.log('GIF-зображення відправлено');
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
            console.log('Стікер відправлено');
          })
          .catch((err) => {
            console.log('Помилка при відправленні стікера', err);
          });
      }
    }
  }
});


const cookieParser = require('cookie-parser');

// db import
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

// set port equal to 3000
const PORT = process.env.PORT || 3000;

// connect to DB
connectDB();

//logger
app.use(logger);

// cors + credentinals
app.use(credentials);
app.use(cors(corsOptions));

// jshow json and etc
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// access static data
app.use(express.static(path.join(__dirname, '/public')));
app.use('/settings', express.static(path.join(__dirname, '/public')));
app.use('/profile', express.static(path.join(__dirname, '/public')));
app.use('/game', express.static(path.join(__dirname, '/public')));

// router
app.use('/', require('./routes/root'));
app.use('/game', require('./routes/game'));
app.use('/settings', require('./routes/settings'));
// api
// auth
app.use('/auth', require('./routes/auth'));
// 404
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404', 'index.html'));
  } else if (req.accepts('json')) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type('txt').send("404 Not Found");
  }
});

mongoose.connection.once('open', () => {
  console.log('Connected to DB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});