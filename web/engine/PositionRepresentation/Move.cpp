// Тип фігури на клітині, куди зроблено хід 

#include <iostream>
#include "Flag.cpp"
// Структура Move
struct Move {
    uint8_t from;              // Координата клітинки початку
    uint8_t to;                // Координата клітинки кінця
    uint8_t pieceSide;         // Сторона фігури
    uint8_t pieceType;         // Тип фігури (0-5: пішак, кінь, слон, тура, ферзь, король)
    uint8_t attackedPieceType; // Тип фігури на клітині, що атакують
    uint8_t attackedSide;    // Сторона фігури, що атакує
    uint8_t flag;             // Флаг

    // Конструктор за замовчуванням
    Move(){
        this->from = 0;
        this->to=0;
        this->pieceSide=0;
        this->pieceType = 0;
        this->attackedPieceType = 0;
        this->attackedSide = 0;
        this->flag = 0;
    }

    // Конструктор з параметрами
    Move(uint8_t f, uint8_t t, uint8_t ps, uint8_t pt, uint8_t apt, uint8_t as, uint8_t fl = Flag::Default)
    {
        this->from = f;
        this->to=t;
        this->pieceSide=ps;
        this->pieceType = pt;
        this->attackedPieceType = apt;
        this->attackedSide = as;
        this->flag = fl;
    }
        
    Move (Move &other)
    {
        this->from = other.from;
        this->to = other.to;
        this->pieceSide = other.pieceSide;
        this->pieceType = other.pieceType;
        this->attackedPieceType = other.attackedPieceType;
        this->attackedSide = other.attackedSide;
        this->flag = other.flag;
    }
    // Перевантаження оператора ==
    bool operator==(const Move& other) const {
        return from == other.from &&
               to == other.to &&
               pieceSide == other.pieceSide &&
               pieceType == other.pieceType &&
               attackedPieceType == other.attackedPieceType &&
               attackedSide == other.attackedSide &&
               flag == other.flag;
    }
};
