#include "MoveList.cpp"
#include "PseudoLegalMoveMaskGeneration.cpp"
//#include "../PositionRepresentation/Flag.cpp"
#pragma once


class LegalMoveGeneration {
public:
    static MoveList generate(Position position, uint8_t side, bool only_captures = false);
private:
    static void piece_mask_to_moves(Pieces pieces, Bitboard mask, uint8_t attacker_p, uint8_t attacker_type, uint8_t attacker_side, MoveList &moves);
    static void pawn_mask_to_moves(Pieces pieces, Bitboard mask, uint8_t attacker_side, int8_t attacker_index, bool look_for_defender, uint8_t flag, MoveList &moves);

    static bool is_legal(Pieces pieces, Move move, bool en_passant_capture);

    static void add_en_passant_captures(Pieces pieces, uint8_t side, uint8_t en_passant, MoveList &moves);
    static void add_castling_moves(Pieces pieces, uint8_t side, bool long_castling, bool short_castling, MoveList &moves);
};


MoveList LegalMoveGeneration::generate(Position position, uint8_t side, bool only_captures) {
    MoveList moves;

    Bitboard pawn_left_captures_mask = PseudoLegalMoveMaskGeneration::generate_pawn_left_captures_mask(position.pieces, side, false);
    Bitboard pawn_right_captures_mask = PseudoLegalMoveMaskGeneration::generate_pawn_right_captures_mask(position.pieces, side, false);

    int8_t pawn_left_capture;
    int8_t pawn_right_capture;

    if (side == Pieces::White) {
        pawn_left_capture = -7;
        pawn_right_capture = -9;
    }
    else {
        pawn_left_capture = 9;
        pawn_right_capture = 7;
    }

    LegalMoveGeneration::pawn_mask_to_moves(position.pieces, pawn_left_captures_mask, side, pawn_left_capture, true, Flag::Default, moves);
    LegalMoveGeneration::pawn_mask_to_moves(position.pieces, pawn_right_captures_mask, side, pawn_right_capture, true, Flag::Default, moves);

    if (!only_captures) {
        Bitboard pawn_default_mask = PseudoLegalMoveMaskGeneration::generate_pawn_default_mask(position.pieces, side);
        Bitboard pawn_long_mask = PseudoLegalMoveMaskGeneration::generate_pawn_long_mask(position.pieces, side);

        int8_t pawn_default_move;
        int8_t pawn_long_move;

        if (side == Pieces::White) {
            pawn_default_move = -8;
            pawn_long_move = -16;
        }
        else {
            pawn_default_move = 8;
            pawn_long_move = 16;
        }

        LegalMoveGeneration::pawn_mask_to_moves(position.pieces, pawn_default_mask, side, pawn_default_move, false, Flag::Default, moves);
        LegalMoveGeneration::pawn_mask_to_moves(position.pieces, pawn_long_mask, side, pawn_long_move, false, Flag::PawnLongMove, moves);
    }

    Bitboard all_knights = position.pieces.pieceBitboards[side][Pieces::Knight];
    Bitboard all_bishops = position.pieces.pieceBitboards[side][Pieces::Bishop];
    Bitboard all_rooks = position.pieces.pieceBitboards[side][Pieces::Rook];
    Bitboard all_queens = position.pieces.pieceBitboards[side][Pieces::Queen];

    uint8_t attacker_p;
    Bitboard mask;

    while (all_knights) {
        attacker_p = BitboardOperations::bsf(all_knights);
        BitboardOperations::set_0(all_knights, attacker_p);
        mask = PseudoLegalMoveMaskGeneration::generate_knight_mask(position.pieces, attacker_p, side, only_captures);
        LegalMoveGeneration::piece_mask_to_moves(position.pieces, mask, attacker_p, Pieces::Knight, side, moves);
    }
    while (all_bishops) {
        attacker_p = BitboardOperations::bsf(all_bishops);
        BitboardOperations::set_0(all_bishops, attacker_p);
        mask = PseudoLegalMoveMaskGeneration::generate_bishop_mask(position.pieces, attacker_p, side, only_captures);
        LegalMoveGeneration::piece_mask_to_moves(position.pieces, mask, attacker_p, Pieces::Bishop, side, moves);
    }
    while (all_rooks) {
        attacker_p = BitboardOperations::bsf(all_rooks);
        BitboardOperations::set_0(all_rooks, attacker_p);
        mask = PseudoLegalMoveMaskGeneration::generate_rook_mask(position.pieces, attacker_p, side, only_captures);
        LegalMoveGeneration::piece_mask_to_moves(position.pieces, mask, attacker_p, Pieces::Rook, side, moves);
    }
    while (all_queens) {
        attacker_p = BitboardOperations::bsf(all_queens);
        BitboardOperations::set_0(all_queens, attacker_p);
        mask = PseudoLegalMoveMaskGeneration::generate_queen_mask(position.pieces, attacker_p, side, only_captures);
        LegalMoveGeneration::piece_mask_to_moves(position.pieces, mask, attacker_p, Pieces::Queen, side, moves);
    }

    attacker_p = BitboardOperations::bsf(position.pieces.pieceBitboards[side][Pieces::King]);
    mask = PseudoLegalMoveMaskGeneration::generate_king_mask(position.pieces, attacker_p, side, only_captures);
    LegalMoveGeneration::piece_mask_to_moves(position.pieces, mask, attacker_p, Pieces::King, side, moves);

    LegalMoveGeneration::add_en_passant_captures(position.pieces, side, position.en_passant, moves);
    if (!only_captures) {
        if (side == Pieces::White) LegalMoveGeneration::add_castling_moves(position.pieces, Pieces::White, position.w_l_castling,position.w_s_castling, moves);
        else LegalMoveGeneration::add_castling_moves(position.pieces, Pieces::Black, position.b_l_castling,position.b_l_castling, moves);
    }

    return moves;
}
void LegalMoveGeneration::piece_mask_to_moves(Pieces pieces, Bitboard mask, uint8_t attacker_p, uint8_t attacker_type, uint8_t attacker_side, MoveList &moves) {
    uint8_t defender_p;
    uint8_t defender_type;

    Move move;

    while (mask) {
        defender_p = BitboardOperations::bsf(mask);
        BitboardOperations::set_0(mask, defender_p);

        defender_type = 255;
        for (uint8_t i = 0; i < 6; i = i + 1) {
            if (BitboardOperations::get_bit(pieces.pieceBitboards[Pieces::inverse(attacker_side)][i], defender_p)) {
                defender_type = i;
                break;
            }
        }

        move = {attacker_p, defender_p, attacker_type, attacker_side, defender_type, Pieces::inverse(attacker_side)};

        if (LegalMoveGeneration::is_legal(pieces, move, false)) moves.push_back(move);
    }
}
void LegalMoveGeneration::pawn_mask_to_moves(Pieces pieces, Bitboard mask, uint8_t attacker_side, int8_t attacker_index, bool look_for_defender, uint8_t flag, MoveList &moves) {
    uint8_t defender_p;
    uint8_t defender_type = 255;

    Move move;

    while (mask) {
        defender_p = BitboardOperations::bsf(mask);
        BitboardOperations::set_0(mask, defender_p);

        if (look_for_defender) {
            defender_type = 255;
            for (uint8_t i = 0; i < 6; i = i + 1) {
                if (BitboardOperations::get_bit(pieces.pieceBitboards[Pieces::inverse(attacker_side)][i], defender_p)) {
                    defender_type = i;
                    break;
                }
            }
        }

        move = {(uint8_t)(defender_p + attacker_index), defender_p, Pieces::Pawn, attacker_side, defender_type, Pieces::inverse(attacker_side), flag};

        if (LegalMoveGeneration::is_legal(pieces, move, false)) {
            if (defender_p < 8 || defender_p > 55) {
                moves.push_back({(uint8_t)(defender_p + attacker_index), defender_p, 0, attacker_side, defender_type, Pieces::inverse(attacker_side), Flag::PromoteToKnight});
                moves.push_back({(uint8_t)(defender_p + attacker_index), defender_p, 0, attacker_side, defender_type, Pieces::inverse(attacker_side), Flag::PromoteToBishop});
                moves.push_back({(uint8_t)(defender_p + attacker_index), defender_p, 0, attacker_side, defender_type, Pieces::inverse(attacker_side), Flag::PromoteToRook});
                moves.push_back({(uint8_t)(defender_p + attacker_index), defender_p, 0, attacker_side, defender_type, Pieces::inverse(attacker_side), Flag::PromoteToQueen});
            }
            else moves.push_back(move);
        }
    }
}
bool LegalMoveGeneration::is_legal(Pieces pieces, Move move, bool en_passant_capture) {
    BitboardOperations::set_0(pieces.pieceBitboards[move.pieceSide][move.pieceType], move.from);
    BitboardOperations::set_1(pieces.pieceBitboards[move.pieceSide][move.pieceType], move.to);
    if (move.attackedPieceType != 255) BitboardOperations::set_0(pieces.pieceBitboards[move.attackedSide][move.attackedPieceType], move.to);
    if (en_passant_capture) {
        if (move.attackedPieceType == Pieces::White) BitboardOperations::set_0(pieces.pieceBitboards[Pieces::Black][Pieces::Pawn], move.to - 8);
        BitboardOperations::set_0(pieces.pieceBitboards[Pieces::White][Pieces::Pawn], move.to + 8);
    }

    pieces.update_bitboards();

    if (PseudoLegalMoveMaskGeneration::in_danger(pieces, BitboardOperations::bsf(pieces.pieceBitboards[move.pieceSide][Pieces::King]), move.pieceSide)) return false;

    return true;
}
void LegalMoveGeneration::add_en_passant_captures(Pieces pieces, uint8_t side, uint8_t en_passant, MoveList &moves) {
    if (en_passant == 255) return;

    Move move;

    if (side == Pieces::White) {
        if (en_passant % 8 != 7 && BitboardOperations::get_bit(pieces.pieceBitboards[Pieces::White][Pieces::Pawn], en_passant - 7)) {
            move = {(uint8_t)(en_passant - 7), en_passant, Pieces::Pawn, Pieces::White, 255, 255, Flag::EnPassantCapture};
            if (LegalMoveGeneration::is_legal(pieces, move, true)) moves.push_back(move);
        }
        if (en_passant % 8 != 0 && BitboardOperations::get_bit(pieces.pieceBitboards[Pieces::White][Pieces::Pawn], en_passant - 9)) {
            move = {(uint8_t)(en_passant - 9), en_passant, Pieces::Pawn, Pieces::White, 255, 255, Flag::EnPassantCapture};
            if (LegalMoveGeneration::is_legal(pieces, move, true)) moves.push_back(move);
        }
    }
    else {
        if (en_passant % 8 != 0 && BitboardOperations::get_bit(pieces.pieceBitboards[Pieces::Black][Pieces::Pawn], en_passant + 7)) {
            move = {(uint8_t)(en_passant + 7), en_passant, Pieces::Pawn, Pieces::Black, 255, 255, Flag::EnPassantCapture};
            if (LegalMoveGeneration::is_legal(pieces, move, true)) moves.push_back(move);
        }
        if (en_passant % 8 != 7 && BitboardOperations::get_bit(pieces.pieceBitboards[Pieces::Black][Pieces::Pawn], en_passant + 9)) {
            move = {(uint8_t)(en_passant + 9), en_passant, Pieces::Pawn, Pieces::Black, 255, 255, Flag::EnPassantCapture};
            if (LegalMoveGeneration::is_legal(pieces, move, true)) moves.push_back(move);
        }
    }
}
void LegalMoveGeneration::add_castling_moves(Pieces pieces, uint8_t side, bool long_castling, bool short_castling, MoveList &moves) {
    uint8_t index;
    uint8_t long_castling_flag;
    uint8_t short_castling_flag;
    if (side == Pieces::White) {
        index = 0;
        long_castling_flag = Flag::WhiteLongCastling;
        short_castling_flag = Flag::WhiteShortCastling;
    }
    else {
        index = 56;
        long_castling_flag = Flag::BlackLongCastling;
        short_castling_flag = Flag::BlackShortCastling;
    }

    if (long_castling && BitboardOperations::get_bit(pieces.pieceBitboards[side][Pieces::Rook], 0 + index) && BitboardOperations::get_bit(pieces.empty, 1 + index) && BitboardOperations::get_bit(pieces.empty, 2 + index) && BitboardOperations::get_bit(pieces.empty, 3 + index)) {
        if (!PseudoLegalMoveMaskGeneration::in_danger(pieces, BitboardOperations::bsf(pieces.pieceBitboards[side][Pieces::King]), side) && !PseudoLegalMoveMaskGeneration::in_danger(pieces, 2 + index, side) && !PseudoLegalMoveMaskGeneration::in_danger(pieces, 3 + index, side)) moves.push_back({(uint8_t)(4 + index), (uint8_t)(2 + index), Pieces::King, side, 255, 255, long_castling_flag});
    }
    if (short_castling && BitboardOperations::get_bit(pieces.pieceBitboards[side][Pieces::Rook], 7 + index) && BitboardOperations::get_bit(pieces.empty, 5 + index) && BitboardOperations::get_bit(pieces.empty, 6 + index)) {
        if (!PseudoLegalMoveMaskGeneration::in_danger(pieces, BitboardOperations::bsf(pieces.pieceBitboards[side][Pieces::King]), side) && !PseudoLegalMoveMaskGeneration::in_danger(pieces, 5 + index, side) && !PseudoLegalMoveMaskGeneration::in_danger(pieces, 6 + index, side)) moves.push_back({(uint8_t)(4 + index), (uint8_t)(6 + index), Pieces::King, side, 255, 255, short_castling_flag});
    }
}

// int main(){
//     MoveList ml = LegalMoveGeneration::generate(Position("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQK2R", 255, true, true,true,true, 0),Pieces::White,false);
//     for (int i=0; i<ml.size(); i=i+1)
//     {
//         std::cout<<unsigned(ml[i].from)<<" "<<unsigned(ml[i].to)<<" "<<unsigned(ml[i].pieceType)<<' '<<unsigned(ml[i].flag)<<'\n';
//     }
//     return 0;
// }