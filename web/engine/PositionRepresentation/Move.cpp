// Тип фігури на клітині, куди зроблено хід 

#include <iostream>

// Структура Move
struct Move {
    uint8_t from;              // Координата клітинки початку
    uint8_t to;                // Координата клітинки кінця
    uint8_t pieceSide;         // Сторона фігури
    uint8_t pieceType;         // Тип фігури (0-5: пішак, кінь, слон, тура, ферзь, король)
    uint8_t attackedPieceType; // Тип фігури на клітині, що атакують
    uint8_t attackingSide;    // Сторона фігури, що атакує
    uint8_t flag;             // Флаг

    // Конструктор за замовчуванням
    Move() : from(0), to(0), pieceSide(0), pieceType(0), attackedPieceType(0), attackingSide(0), flag(0) {}

    // Конструктор з параметрами
    Move(uint8_t f, uint8_t t, uint8_t ps, uint8_t pt, uint8_t apt, uint8_t as, uint8_t fl)
        : from(f), to(t), pieceSide(ps), pieceType(pt), attackedPieceType(apt), attackingSide(as), flag(fl) {}

    // Перевантаження оператора ==
    bool operator==(const Move& other) const {
        return from == other.from &&
               to == other.to &&
               pieceSide == other.pieceSide &&
               pieceType == other.pieceType &&
               attackedPieceType == other.attackedPieceType &&
               attackingSide == other.attackingSide &&
               flag == other.flag;
    }
};
