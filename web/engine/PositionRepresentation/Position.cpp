#include <cmath>
#include <map>
#include <functional>
#include "RepetitionHistory.cpp"
#include "Move.cpp"


#pragma once


class Position {
public:
    Position();
    Position(const std::string& short_fen, uint8_t en_passant, bool w_l_castling, bool w_s_castling, 
        bool b_l_castling, bool b_s_castling, float move_ctr);

    friend std::ostream& operator <<(std::ostream& ostream, Position position);

    void move(Move move);

    Pieces pieces;
    uint8_t en_passant;

    bool w_l_castling;
    bool w_s_castling;
    bool b_l_castling;
    bool b_s_castling;

    bool white_castling_happened;
    bool black_castling_happened;

    float move_ctr;
    ZobristHash hash;
    float fifty_moves_ctr;
    RepetitionHistory repetition_history;
private:
    void add_piece(uint8_t square, uint8_t type, uint8_t side);
    void remove_piece(uint8_t square, uint8_t type, uint8_t side);
    void change_en_passant(uint8_t en_passant);
    void remove_w_l_castling();
    void remove_w_s_castling();
    void remove_b_l_castling();
    void remove_b_s_castling();
    void update_move_ctr();
    void update_fifty_moves_ctr(bool break_event);
};

Position::Position() = default;
Position::Position(const std::string& short_fen, uint8_t en_passant, bool w_l_castling, 
    bool w_s_castling, bool b_l_castling, bool b_s_castling, float move_ctr) {
    this->pieces = {short_fen};
    this->en_passant = en_passant;

    this->w_l_castling = w_l_castling;
    this->w_s_castling = w_s_castling;
    this->b_l_castling = b_l_castling;
    this->b_s_castling = b_s_castling;

    this->white_castling_happened = false;
    this->black_castling_happened = false;

    this->move_ctr = move_ctr;
    this->hash = {this->pieces, (this->move_ctr - std::floor(this->move_ctr) > 1e-4), this->w_l_castling, 
        this->w_s_castling, this->b_l_castling, this->b_s_castling};
    this->repetition_history.add_position(this->hash);
    this->fifty_moves_ctr = 0;
}
std::ostream &operator<<(std::ostream &ostream, Position position) {
    ostream << position.pieces;

    ostream << ANSI::Red;

    ostream << "En passant: " << (uint32_t)position.en_passant << "\n";
    ostream << "White long castling: " << position.w_l_castling << "\n";
    ostream << "White short castling: " << position.w_s_castling << "\n";
    ostream << "Black long castling: " << position.b_l_castling << "\n";
    ostream << "Black short castling: " << position.b_l_castling << "\n";
    ostream << "Move counter: " << position.move_ctr << "\n";
      ostream << "Zobrist hash: " << std::hex << "0x" << position.hash.hash << "\n" << std::dec;
    ostream << "Fifty moves counter: " << position.fifty_moves_ctr << "\n";
    ostream << "Threefold repetition counter: " << (uint32_t)position.repetition_history.get_repetition_number(position.hash) << "\n";

    ostream << ANSI::End;

    return ostream;
}
void Position::move(Move move) {
    this->remove_piece(move.from, move.pieceType, move.pieceSide);
    this->add_piece(move.to, move.pieceType, move.pieceSide);
    if (move.attackedPieceType != 255) this->remove_piece(move.to, move.attackedPieceType, move.attackedSide);

    std::map<uint8_t, std::function<void()>> flag_actions = {
        {Flag::Default, []{}},
        {Flag::PawnLongMove, [this, move] {
            this->change_en_passant((move.from + move.to) / 2);
        }},
        {Flag::EnPassantCapture, [this, move] {
            if (move.pieceSide == Pieces::White) 
                this->remove_piece(move.to - 8, Pieces::Pawn, Pieces::Black);
            else 
                this->remove_piece(move.to + 8, Pieces::Pawn, Pieces::White);
        }},
        {Flag::WhiteLongCastling, [this] {
            this->remove_piece(0, Pieces::Rook, Pieces::White);
            this->add_piece(3, Pieces::Rook, Pieces::White);
            this->white_castling_happened = true;
        }},
        {Flag::WhiteShortCastling, [this] {
            
            this->remove_piece(7, Pieces::Rook, Pieces::White);
            this->add_piece(5, Pieces::Rook, Pieces::White);
            this->white_castling_happened = true;
        }},
        {Flag::BlackLongCastling, [this] {
            this->remove_piece(56, Pieces::Rook, Pieces::Black);
            this->add_piece(59, Pieces::Rook, Pieces::Black);
            this->black_castling_happened = true;
        }},
        {Flag::BlackShortCastling, [this] {
            this->remove_piece(63, Pieces::Rook, Pieces::Black);
            this->add_piece(61, Pieces::Rook, Pieces::Black);
            this->black_castling_happened = true;
        }},
        {Flag::PromoteToKnight, [this, move] {
            this->remove_piece(move.to, Pieces::Pawn, move.pieceSide);
            this->add_piece(move.to, Pieces::Knight, move.pieceSide);
        }},
        {Flag::PromoteToBishop, [this, move] {
            this->remove_piece(move.to, Pieces::Pawn, move.pieceSide);
            this->add_piece(move.to, Pieces::Bishop, move.pieceSide);
        }},
        {Flag::PromoteToRook, [this, move] {
            this->remove_piece(move.to, Pieces::Pawn, move.pieceSide);
            this->add_piece(move.to, Pieces::Rook, move.pieceSide);
        }},
        {Flag::PromoteToQueen, [this, move] {
            this->remove_piece(move.to, Pieces::Pawn, move.pieceSide);
            this->add_piece(move.to, Pieces::Queen, move.pieceSide);
        }}
    };

    if(flag_actions.count(move.flag) > 0){
        flag_actions[move.flag]();
    }

    this->pieces.update_bitboards();

    if (move.flag != Flag::PawnLongMove) this->change_en_passant(255);

    std::map<int, std::function<void()>> position_map {
        {0, [this]() { this->remove_w_l_castling(); }},
        {4, [this]() { this->remove_w_l_castling(); this->remove_w_s_castling(); }},
        {7, [this]() { this->remove_w_s_castling(); }},
        {56, [this]() { this->remove_b_l_castling(); }},
        {60, [this]() { this->remove_b_l_castling(); this->remove_b_s_castling(); }},
        {63, [this]() { this->remove_b_s_castling(); }}
    };

    if (position_map.count(move.from) > 0) {
        position_map[move.from]();
    }

    this->update_move_ctr();

    this->update_fifty_moves_ctr(move.pieceType == Pieces::Pawn || move.attackedPieceType != 255);

    if (move.pieceType == Pieces::Pawn || move.attackedPieceType != 255) this->repetition_history.clear();
    this->repetition_history.add_position(this->hash);
}
void Position::add_piece(uint8_t square, uint8_t type, uint8_t side) {
    if (!BitboardOperations::get_bit(this->pieces.pieceBitboards[side][type], square)) {
        BitboardOperations::set_1(this->pieces.pieceBitboards[side][type], square);
        this->hash.invert_piece(square, type, side);
    }
}
void Position::remove_piece(uint8_t square, uint8_t type, uint8_t side) {
    if (BitboardOperations::get_bit(this->pieces.pieceBitboards[side][type], square)) {
        BitboardOperations::set_0(this->pieces.pieceBitboards[side][type], square);
        this->hash.invert_piece(square, type, side);
    }
}
void Position::change_en_passant(uint8_t en_passant) {
    this->en_passant = en_passant;
}
void Position::remove_w_l_castling() {
    if (this->w_l_castling) {
        this->w_l_castling = false;
        this->hash.invert_w_l_castling();
    }
}
void Position::remove_w_s_castling() {
    if (this->w_s_castling) {
        this->w_s_castling = false;
        this->hash.invert_w_s_castling();
    }
}
void Position::remove_b_l_castling() {
    if (this->b_l_castling) {
        this->b_l_castling = false;
        this->hash.invert_b_l_castling();
    }
}
void Position::remove_b_s_castling() {
    if (this->b_s_castling) {
        this->b_s_castling = false;
        this->hash.invert_b_s_castling();
    }
}
void Position::update_move_ctr() {
    this->move_ctr = this->move_ctr + 0.5f;
    this->hash.invert_move();
}
void Position::update_fifty_moves_ctr(bool break_event) {
    if (break_event) this->fifty_moves_ctr = 0;
    else this->fifty_moves_ctr = this->fifty_moves_ctr + 0.5f;
}