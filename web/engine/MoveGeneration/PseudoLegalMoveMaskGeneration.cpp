#include "../PositionRepresentation/Position.cpp"
#include "KnightMasks.cpp"
#include "KingMasks.cpp"
#include "SlidersMasks.cpp"



#pragma once


class PseudoLegalMoveMaskGenaration {
public:
    static Bitboard generate_pawn_default_mask(Pieces pieces, uint8_t side);
    static Bitboard generate_pawn_long_mask(Pieces pieces, uint8_t side);
    static Bitboard generate_pawn_left_captures_mask(Pieces pieces, uint8_t side, bool include_all_possible_captures);
    static Bitboard generate_pawn_right_captures_mask(Pieces pieces, uint8_t side, bool include_all_possible_captures);

    static Bitboard generate_knight_mask(Pieces pieces, uint8_t p, uint8_t side, bool only_captures);
    static Bitboard generate_bishop_mask(Pieces pieces, uint8_t p, uint8_t side, bool only_captures);
    static Bitboard generate_rook_mask(Pieces pieces, uint8_t p, uint8_t side, bool only_captures);
    static Bitboard generate_queen_mask(Pieces pieces, uint8_t p, uint8_t side, bool only_captures);
    static Bitboard generate_king_mask(Pieces pieces, uint8_t p, uint8_t side, bool only_captures);

    static bool in_danger(Pieces pieces, uint8_t p, uint8_t side);
private:
    static Bitboard calc_ray(Pieces pieces, uint8_t p, uint8_t side, bool only_captures, uint8_t direction, bool bsr);
};

Bitboard PseudoLegalMoveMaskGenaration::generate_pawn_default_mask(Pieces pieces, uint8_t side) {
    if (side == Pieces::White) {
        return (pieces.pieceBitboards[Pieces::White][Pieces::Pawn] << 8) & pieces.empty;
    }
    return (pieces.pieceBitboards[Pieces::Black][Pieces::Pawn] >> 8) & pieces.empty;
}
Bitboard PseudoLegalMoveMaskGenaration::generate_pawn_long_mask(Pieces pieces, uint8_t side) {
    Bitboard default_mask = PseudoLegalMoveMaskGenaration::generate_pawn_default_mask(pieces, side);

    if (side == Pieces::White) {
        return ((default_mask & BitboardRows::Rows[2]) << 8) & pieces.empty;
    }
    return ((default_mask & BitboardRows::Rows[5]) >> 8) & pieces.empty;
}
Bitboard PseudoLegalMoveMaskGenaration::generate_pawn_left_captures_mask(Pieces pieces, uint8_t side, bool include_all_possible_captures) {
    if (side == Pieces::White) {
        Bitboard mask = (pieces.pieceBitboards[Pieces::White][Pieces::Pawn] << 7) & BitboardColumns::InversionColumns[7];
        if (!include_all_possible_captures) mask = mask & pieces.sideBitboards[Pieces::Black];

        return mask;
    }

    Bitboard mask = (pieces.pieceBitboards[Pieces::Black][Pieces::Pawn] >> 9) & BitboardColumns::InversionColumns[7];
    if (!include_all_possible_captures) mask = mask & pieces.sideBitboards[Pieces::White];
    return mask;
}
Bitboard PseudoLegalMoveMaskGenaration::generate_pawn_right_captures_mask(Pieces pieces, uint8_t side, bool include_all_possible_captures) {
    if (side == Pieces::White) {
        Bitboard mask = (pieces.pieceBitboards[Pieces::White][Pieces::Pawn] << 9) & BitboardColumns::InversionColumns[0];
        if (!include_all_possible_captures) mask = mask & pieces.sideBitboards[Pieces::Black];

        return mask;
    }

    Bitboard mask = (pieces.pieceBitboards[Pieces::Black][Pieces::Pawn] >> 7) & BitboardColumns::InversionColumns[0];
    if (!include_all_possible_captures) mask = mask & pieces.sideBitboards[Pieces::White];
    return mask;
}
Bitboard PseudoLegalMoveMaskGenaration::generate_knight_mask(Pieces pieces, uint8_t p, uint8_t side, bool only_captures) {
    if (only_captures) {
        return KnightMasks::Masks[p] & pieces.sideBitboards[Pieces::inverse(side)];
    }
    return KnightMasks::Masks[p] & pieces.inversionSideBitboards[side];
}
Bitboard PseudoLegalMoveMaskGenaration::generate_bishop_mask(Pieces pieces, uint8_t p, uint8_t side, bool only_captures) {
    Bitboard nw = PseudoLegalMoveMaskGenaration::calc_ray(pieces, p, side, only_captures, Direction::NorthWest, false);
    Bitboard ne = PseudoLegalMoveMaskGenaration::calc_ray(pieces, p, side, only_captures, Direction::NorthEast, false);
    Bitboard sw = PseudoLegalMoveMaskGenaration::calc_ray(pieces, p, side, only_captures, Direction::SouthWest, true);
    Bitboard se = PseudoLegalMoveMaskGenaration::calc_ray(pieces, p, side, only_captures, Direction::SouthEast, true);

    return nw | ne | sw | se;
}
Bitboard PseudoLegalMoveMaskGenaration::generate_rook_mask(Pieces pieces, uint8_t p, uint8_t side, bool only_captures) {
    Bitboard n = PseudoLegalMoveMaskGenaration::calc_ray(pieces, p, side, only_captures, Direction::North, false);
    Bitboard s = PseudoLegalMoveMaskGenaration::calc_ray(pieces, p, side, only_captures, Direction::South, true);
    Bitboard w = PseudoLegalMoveMaskGenaration::calc_ray(pieces, p, side, only_captures, Direction::West, true);
    Bitboard e = PseudoLegalMoveMaskGenaration::calc_ray(pieces, p, side, only_captures, Direction::East, false);

    return n | s | w | e;
}
Bitboard PseudoLegalMoveMaskGenaration::generate_queen_mask(Pieces pieces, uint8_t p, uint8_t side, bool only_captures) {
    Bitboard bishop_mask = PseudoLegalMoveMaskGenaration::generate_bishop_mask(pieces, p, side, only_captures);
    Bitboard rook_mask = PseudoLegalMoveMaskGenaration::generate_rook_mask(pieces, p, side, only_captures);

    return bishop_mask | rook_mask;
}
Bitboard PseudoLegalMoveMaskGenaration::generate_king_mask(Pieces pieces, uint8_t p, uint8_t side, bool only_captures) {
    if (only_captures) {
        return KingMasks::Masks[p] & pieces.sideBitboards[Pieces::inverse(side)];
    }
    return KingMasks::Masks[p] & pieces.inversionSideBitboards[side];
}
bool PseudoLegalMoveMaskGenaration::in_danger(Pieces pieces, uint8_t p, uint8_t side) {
    Bitboard opposite_pawns_left_captures = PseudoLegalMoveMaskGenaration::generate_pawn_left_captures_mask(pieces, Pieces::inverse(side), true);
    Bitboard opposite_pawns_right_captures = PseudoLegalMoveMaskGenaration::generate_pawn_right_captures_mask(pieces, Pieces::inverse(side), true);
    Bitboard opposite_pawns_captures = opposite_pawns_left_captures | opposite_pawns_right_captures;

    if (BitboardOperations::get_bit(opposite_pawns_captures, p)) return true;

    if (PseudoLegalMoveMaskGenaration::generate_knight_mask(pieces, p, side, true) & pieces.pieceBitboards[Pieces::inverse(side)][Pieces::Knight]) return true;
    if (PseudoLegalMoveMaskGenaration::generate_bishop_mask(pieces, p, side, true) & pieces.pieceBitboards[Pieces::inverse(side)][Pieces::Bishop]) return true;
    if (PseudoLegalMoveMaskGenaration::generate_rook_mask(pieces, p, side, true) & pieces.pieceBitboards[Pieces::inverse(side)][Pieces::Rook]) return true;
    if (PseudoLegalMoveMaskGenaration::generate_queen_mask(pieces, p, side, true) & pieces.pieceBitboards[Pieces::inverse(side)][Pieces::Queen]) return true;
    if (PseudoLegalMoveMaskGenaration::generate_king_mask(pieces, p, side, true) & pieces.pieceBitboards[Pieces::inverse(side)][Pieces::King]) return true;

    return false;
}
Bitboard PseudoLegalMoveMaskGenaration::calc_ray(Pieces pieces, uint8_t p, uint8_t side, bool only_captures, uint8_t direction, bool bsr) {
    Bitboard blockers = SlidersMasks::Masks[p][direction] & pieces.all;

    if (blockers == 0) {
        if (only_captures) return 0;
        return SlidersMasks::Masks[p][direction];
    }

    uint8_t blocking_square;

    if (bsr) blocking_square = BitboardOperations::bsr(blockers);
    else blocking_square = BitboardOperations::bsf(blockers);

    Bitboard moves;

    if (only_captures) moves = 0;
    else moves = SlidersMasks::Masks[p][direction] ^ SlidersMasks::Masks[blocking_square][direction];

    if (BitboardOperations::get_bit(pieces.sideBitboards[side], blocking_square)) BitboardOperations::set_0(moves, blocking_square);
    else BitboardOperations::set_1(moves, blocking_square);

    return moves;
}


// int main(){
//     BitboardOperations::print(PseudoLegalMoveMaskGenaration::generate_pawn_long_mask(Pieces("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"), 1));
//     std::cout<<'\n';
//     BitboardOperations::print(PseudoLegalMoveMaskGenaration::generate_pawn_default_mask(Pieces("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"), 1));
//     std::cout<<'\n';
//     BitboardOperations::print(PseudoLegalMoveMaskGenaration::generate_pawn_left_captures_mask(Pieces("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"), 1, true));
//     std::cout<<'\n';
//     BitboardOperations::print(PseudoLegalMoveMaskGenaration::generate_pawn_left_captures_mask(Pieces("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"), 1,false));
//     std::cout<<'\n';
//     BitboardOperations::print(PseudoLegalMoveMaskGenaration::generate_pawn_right_captures_mask(Pieces("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"), 1, true));
//     std::cout<<'\n';
//     BitboardOperations::print(PseudoLegalMoveMaskGenaration::generate_pawn_right_captures_mask(Pieces("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"), 1,false));
//     std::cout<<'\n';
//     BitboardOperations::print(PseudoLegalMoveMaskGenaration::generate_knight_mask(Pieces("rnbqkbnr/8/8/8/8/8/8/RNBQKBNR"), 1, 0, false));
//     std::cout<<'\n';
//     BitboardOperations::print(PseudoLegalMoveMaskGenaration::generate_bishop_mask(Pieces("rnbqkbnr/8/8/8/8/8/8/RNBQKBNR"), 2, 0,false));
//     std::cout<<'\n';
//     BitboardOperations::print(PseudoLegalMoveMaskGenaration::generate_rook_mask(Pieces("rnbqkbnr/8/8/8/8/8/8/RNBQKBNR"), 0, 0,false));
//     std::cout<<'\n';
//     BitboardOperations::print(PseudoLegalMoveMaskGenaration::generate_king_mask(Pieces("rnbqkbnr/8/8/8/8/8/8/RNBQKBNR"), 4, 0,false));
//     std::cout<<'\n';
//     BitboardOperations::print(PseudoLegalMoveMaskGenaration::generate_queen_mask(Pieces("rnbqkbnr/8/8/8/8/8/8/RNBQKBNR"), 3, 0,false));
//     std::cout<<'\n';
//     BitboardOperations::print(PseudoLegalMoveMaskGenaration::generate_knight_mask(Pieces("rnbqkbnr/8/8/8/8/8/8/RNBQKBNR"), 1, 0, true));
//     std::cout<<'\n';
//     BitboardOperations::print(PseudoLegalMoveMaskGenaration::generate_bishop_mask(Pieces("rnbqkbnr/8/8/8/8/8/8/RNBQKBNR"), 2, 0,true));
//     std::cout<<'\n';
//     BitboardOperations::print(PseudoLegalMoveMaskGenaration::generate_rook_mask(Pieces("rnbqkbnr/8/8/8/8/8/8/RNBQKBNR"), 0, 0,true));
//     std::cout<<'\n';
//     BitboardOperations::print(PseudoLegalMoveMaskGenaration::generate_king_mask(Pieces("rnbqkbnr/8/8/8/8/8/8/RNBQKBNR"), 4, 0,true));
//     std::cout<<'\n';
//     BitboardOperations::print(PseudoLegalMoveMaskGenaration::generate_queen_mask(Pieces("rnbqkbnr/8/8/8/8/8/8/RNBQKBNR"), 3, 0,true));
//     std::cout<<'\n';
//     std::cout<<PseudoLegalMoveMaskGenaration::in_danger(Pieces("rnbqkbnr/8/8/8/8/8/8/RNBQKBNR"),4,0);
//     std::cout<<'\n';
//     std::cout<<PseudoLegalMoveMaskGenaration::in_danger(Pieces("rnbkqbnr/8/8/8/8/8/8/RNBQKBNR"),4,0);
//     return 0;
// }