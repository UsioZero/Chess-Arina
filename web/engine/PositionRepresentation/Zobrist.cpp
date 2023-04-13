#include "Pieces.cpp"
#include "ZobristHashConstants.cpp"


#pragma once


struct ZobristHash {
    ZobristHash();
    ZobristHash(Pieces pieces, bool black_move, bool w_l_castling, bool w_s_castling, bool b_l_castling, bool b_s_castling);

    friend bool operator ==(ZobristHash left, ZobristHash right);
    friend bool operator <(ZobristHash left, ZobristHash right);

    void invert_piece(uint8_t square, uint8_t type, uint8_t side);
    void invert_move();
    void invert_w_l_castling();
    void invert_w_s_castling();
    void invert_b_l_castling();
    void invert_b_s_castling();

    uint64_t hash;
};
ZobristHash::ZobristHash() = default;
ZobristHash::ZobristHash(Pieces pieces, bool black_move, bool w_l_castling, bool w_s_castling, bool b_l_castling, bool b_s_castling) {
    this->hash = 0;

    if (black_move) this->invert_move();
    if (w_l_castling) this->invert_w_l_castling();
    if (w_s_castling) this->invert_w_s_castling();
    if (b_l_castling) this->invert_b_l_castling();
    if (b_s_castling) this->invert_b_s_castling();

    uint8_t side;
    for (uint8_t square = 0; square < 64; square = square + 1) {
        if (BitboardOperations::get_bit(pieces.sideBitboards[Pieces::White], square)) side = Pieces::White;
        else if (BitboardOperations::get_bit(pieces.sideBitboards[Pieces::Black], square)) side = Pieces::Black;
        else continue;

        for (uint8_t type = 0; type < 6; type = type + 1) {
            if (BitboardOperations::get_bit(pieces.pieceBitboards[side][type], square)) {
                this->invert_piece(square, type, side);
                break;
            }
        }
    }
}
bool operator ==(ZobristHash left, ZobristHash right) {
    return (left.hash == right.hash);
}
bool operator <(ZobristHash left, ZobristHash right) {
    return (left.hash < right.hash);
}
void ZobristHash::invert_piece(uint8_t square, uint8_t type, uint8_t side) {
    this->hash = this->hash ^ ZobristHashConstants::Constants[square][side][type];
}
void ZobristHash::invert_move() {
    this->hash = this->hash ^ ZobristHashConstants::BlackMove;
}
void ZobristHash::invert_w_l_castling() {
    this->hash = this->hash ^ ZobristHashConstants::WhiteLongCastling;
}
void ZobristHash::invert_w_s_castling() {
    this->hash = this->hash ^ ZobristHashConstants::WhiteShortCastling;
}
void ZobristHash::invert_b_l_castling() {
    this->hash = this->hash ^ ZobristHashConstants::BlackLongCastling;
}
void ZobristHash::invert_b_s_castling() {
    this->hash = this->hash ^ ZobristHashConstants::BlackShortCastling;
}
