#include "../MoveGeneration/PseudoLegalMoveMaskGeneration.cpp"
#include "PassedPawnMasks.cpp"
#include "PawnShieldMasks.cpp"


#pragma once


class StaticEvaluator {
public:
    static int32_t evaluate(Pieces pieces, bool w_l_castling, bool w_s_castling, bool b_l_castling, bool b_s_castling, bool white_castling_happened, bool black_castling_happened, bool show_debug_info = false);
private:
    static int32_t material(Pieces pieces);
    static int32_t mobility(Pieces pieces);
    static int32_t pawn_structure_double_pawn(Pieces pieces);
    static int32_t pawn_structure_connected_pawn(Pieces pieces);
    static int32_t pawn_structure_pawn_promotion(Pieces pieces);
    static int32_t king_safety_crashed_castling(bool w_l_castling, bool w_s_castling, bool b_l_castling, bool b_s_castling, bool white_castling_happened, bool black_castling_happened);
    static int32_t king_safety_pawn_shield(Pieces pieces, bool white_castling_happened, bool black_castling_happened);
    static int32_t two_bishops(Pieces pieces);
    static int32_t endgame(Pieces pieces, bool white_leading);

    struct Material {
        static constexpr int32_t Pawn = 100;
        static constexpr int32_t Knight = 305;
        static constexpr int32_t Bishop = 333;
        static constexpr int32_t Rook = 563;
        static constexpr int32_t Queen = 950;
    };
    struct Mobility {
        static constexpr int32_t Knight = 9;
        static constexpr int32_t Bishop = 4;
        static constexpr int32_t Rook = 3;
        static constexpr int32_t Queen = 3;
    };
    struct PawnStructure {
        static constexpr int32_t DoublePawn = -25;
        static constexpr int32_t ConnectedPawn = 12;
        static constexpr std::array<int32_t, 8> DefaultPawnPromotion = {0, 0, 0, 0, 10, 20, 30, 0};
        static constexpr std::array<int32_t, 8> PassedPawnPromotion = {0, 50, 50, 50, 70, 90, 110, 0};
    };
    struct KingSafety {
        static constexpr int32_t CrashedCastling = -50;
        static constexpr int32_t PawnShield = 33;
    };
    static constexpr int32_t TwoBishops = 50;
    struct Endgame {
        static constexpr int32_t MaximumPiecesForEndgame = 8;
        static constexpr int32_t AttackerKingProximityToDefenderKing = 10;
        static constexpr int32_t DistanceBetweenDefenderKingAndMiddle = 10;
    };

    friend class MoveSorter;
};

int32_t StaticEvaluator::evaluate(Pieces pieces, bool w_l_castling, bool w_s_castling, bool b_l_castling, bool b_s_castling, bool white_castling_happened, bool black_castling_happened, bool show_debug_info) {
    int32_t evaluation = 0;

    int32_t material = StaticEvaluator::material(pieces);
    int32_t mobility = StaticEvaluator::mobility(pieces);
    int32_t double_pawn = StaticEvaluator::pawn_structure_double_pawn(pieces);
    int32_t connected_pawn = StaticEvaluator::pawn_structure_connected_pawn(pieces);
    int32_t pawn_promotion = StaticEvaluator::pawn_structure_pawn_promotion(pieces);
    int32_t crashed_castling = StaticEvaluator::king_safety_crashed_castling(w_l_castling, w_s_castling, b_l_castling, b_s_castling, white_castling_happened, black_castling_happened);
    int32_t pawn_shield = StaticEvaluator::king_safety_pawn_shield(pieces, white_castling_happened, black_castling_happened);
    int32_t two_bishops = StaticEvaluator::two_bishops(pieces);
    int32_t endgame = StaticEvaluator::endgame(pieces, material >= 0);

    evaluation = evaluation + material;
    evaluation = evaluation + mobility;
    evaluation = evaluation + double_pawn;
    evaluation = evaluation + connected_pawn;
    evaluation = evaluation + pawn_promotion;
    evaluation = evaluation + crashed_castling;
    evaluation = evaluation + pawn_shield;
    evaluation = evaluation + two_bishops;
    evaluation = evaluation + endgame;

    if (show_debug_info) {
        std::cout << ANSI::Green << "Details of static evaluation of current position." << std::endl;
        std::cout << "Material: " << (float)material / 100.0f << " pawns." << std::endl;
        std::cout << "Mobility: " << (float)mobility / 100.0f << " pawns." << std::endl;
        std::cout << "Double pawn: " << (float)double_pawn / 100.0f << " pawns." << std::endl;
        std::cout << "Connected pawn: " << (float)connected_pawn / 100.0f << " pawns." << std::endl;
        std::cout << "Pawn promotion: " << (float)pawn_promotion / 100.0f << " pawns." << std::endl;
        std::cout << "Crashed castling: " << (float)crashed_castling / 100.0f << " pawns." << std::endl;
        std::cout << "Pawn shield: " << (float)pawn_shield / 100.0f << " pawns." << std::endl;
        std::cout << "Two bishops: " << (float)two_bishops / 100.0f << " pawns." << std::endl;
        std::cout << "Endgame: " << (float)endgame / 100.0f << " pawns." << std::endl;
        std::cout << "Sum: " << (float)evaluation / 100.0f << " pawns." << ANSI::End << std::endl;
    }

    return evaluation;
}
int32_t StaticEvaluator::material(Pieces pieces) {
    int32_t material = 0;

    material = material + StaticEvaluator::Material::Pawn * (BitboardOperations::count_1(pieces.pieceBitboards[Pieces::White][Pieces::Pawn]) - BitboardOperations::count_1(pieces.pieceBitboards[Pieces::Black][Pieces::Pawn]));
    material = material + StaticEvaluator::Material::Knight * (BitboardOperations::count_1(pieces.pieceBitboards[Pieces::White][Pieces::Knight]) - BitboardOperations::count_1(pieces.pieceBitboards[Pieces::Black][Pieces::Knight]));
    material = material + StaticEvaluator::Material::Bishop * (BitboardOperations::count_1(pieces.pieceBitboards[Pieces::White][Pieces::Bishop]) - BitboardOperations::count_1(pieces.pieceBitboards[Pieces::Black][Pieces::Bishop]));
    material = material + StaticEvaluator::Material::Rook * (BitboardOperations::count_1(pieces.pieceBitboards[Pieces::White][Pieces::Rook]) - BitboardOperations::count_1(pieces.pieceBitboards[Pieces::Black][Pieces::Rook]));
    material = material + StaticEvaluator::Material::Queen * (BitboardOperations::count_1(pieces.pieceBitboards[Pieces::White][Pieces::Queen]) - BitboardOperations::count_1(pieces.pieceBitboards[Pieces::Black][Pieces::Queen]));

    return material;
}
int32_t StaticEvaluator::mobility(Pieces pieces) {
    int32_t mobility = 0;

    std::array<std::array<Bitboard, 6>, 2> iteration_masks = pieces.pieceBitboards;
    uint8_t index;

    int32_t knight_moves = 0;
    int32_t bishop_moves = 0;
    int32_t rook_moves = 0;
    int32_t queen_moves = 0;

    while (iteration_masks[Pieces::White][Pieces::Knight]) {
        index = BitboardOperations::bsf(iteration_masks[Pieces::White][Pieces::Knight]);
        BitboardOperations::set_0(iteration_masks[Pieces::White][Pieces::Knight], index);
        knight_moves = knight_moves + BitboardOperations::count_1(PseudoLegalMoveMaskGeneration::generate_knight_mask(pieces, index, Pieces::White, false));
    }
    while (iteration_masks[Pieces::White][Pieces::Bishop]) {
        index = BitboardOperations::bsf(iteration_masks[Pieces::White][Pieces::Bishop]);
        BitboardOperations::set_0(iteration_masks[Pieces::White][Pieces::Bishop], index);
        bishop_moves = bishop_moves + BitboardOperations::count_1(PseudoLegalMoveMaskGeneration::generate_bishop_mask(pieces, index, Pieces::White, false));
    }
    while (iteration_masks[Pieces::White][Pieces::Rook]) {
        index = BitboardOperations::bsf(iteration_masks[Pieces::White][Pieces::Rook]);
        BitboardOperations::set_0(iteration_masks[Pieces::White][Pieces::Rook], index);
        rook_moves = rook_moves + BitboardOperations::count_1(PseudoLegalMoveMaskGeneration::generate_rook_mask(pieces, index, Pieces::White, false));
    }
    while (iteration_masks[Pieces::White][Pieces::Queen]) {
        index = BitboardOperations::bsf(iteration_masks[Pieces::White][Pieces::Queen]);
        BitboardOperations::set_0(iteration_masks[Pieces::White][Pieces::Queen], index);
        queen_moves = queen_moves + BitboardOperations::count_1(PseudoLegalMoveMaskGeneration::generate_queen_mask(pieces, index, Pieces::White, false));
    }

    while (iteration_masks[Pieces::Black][Pieces::Knight]) {
        index = BitboardOperations::bsf(iteration_masks[Pieces::Black][Pieces::Knight]);
        BitboardOperations::set_0(iteration_masks[Pieces::Black][Pieces::Knight], index);
        knight_moves = knight_moves - BitboardOperations::count_1(PseudoLegalMoveMaskGeneration::generate_knight_mask(pieces, index, Pieces::Black, false));
    }
    while (iteration_masks[Pieces::Black][Pieces::Bishop]) {
        index = BitboardOperations::bsf(iteration_masks[Pieces::Black][Pieces::Bishop]);
        BitboardOperations::set_0(iteration_masks[Pieces::Black][Pieces::Bishop], index);
        bishop_moves = bishop_moves - BitboardOperations::count_1(PseudoLegalMoveMaskGeneration::generate_bishop_mask(pieces, index, Pieces::Black, false));
    }
    while (iteration_masks[Pieces::Black][Pieces::Rook]) {
        index = BitboardOperations::bsf(iteration_masks[Pieces::Black][Pieces::Rook]);
        BitboardOperations::set_0(iteration_masks[Pieces::Black][Pieces::Rook], index);
        rook_moves = rook_moves - BitboardOperations::count_1(PseudoLegalMoveMaskGeneration::generate_rook_mask(pieces, index, Pieces::Black, false));
    }
    while (iteration_masks[Pieces::Black][Pieces::Queen]) {
        index = BitboardOperations::bsf(iteration_masks[Pieces::Black][Pieces::Queen]);
        BitboardOperations::set_0(iteration_masks[Pieces::Black][Pieces::Queen], index);
        queen_moves = queen_moves - BitboardOperations::count_1(PseudoLegalMoveMaskGeneration::generate_queen_mask(pieces, index, Pieces::Black, false));
    }

    mobility = mobility + StaticEvaluator::Mobility::Knight * knight_moves;
    mobility = mobility + StaticEvaluator::Mobility::Bishop * bishop_moves;
    mobility = mobility + StaticEvaluator::Mobility::Rook * rook_moves;
    mobility = mobility + StaticEvaluator::Mobility::Queen * queen_moves;

    return mobility;
}
int32_t StaticEvaluator::pawn_structure_double_pawn(Pieces pieces) {
    int32_t double_pawn = 0;

    int32_t double_pawn_ctr = 0;

    uint8_t white_pawns;
    uint8_t black_pawns;

    for (uint8_t x = 0; x < 8; x = x + 1) {
        white_pawns = BitboardOperations::count_1(pieces.pieceBitboards[Pieces::White][Pieces::Pawn] & BitboardColumns::Columns[x]);
        black_pawns = BitboardOperations::count_1(pieces.pieceBitboards[Pieces::Black][Pieces::Pawn] & BitboardColumns::Columns[x]);

        double_pawn_ctr = double_pawn_ctr + std::max(0, white_pawns - 1);
        double_pawn_ctr = double_pawn_ctr - std::max(0, black_pawns - 1);
    }

    double_pawn = double_pawn + StaticEvaluator::PawnStructure::DoublePawn * double_pawn_ctr;

    return double_pawn;
}
int32_t StaticEvaluator::pawn_structure_connected_pawn(Pieces pieces) {
    int32_t connected_pawn = 0;

    int32_t connected_pawn_ctr = 0;

    Bitboard white_captures = PseudoLegalMoveMaskGeneration::generate_pawn_left_captures_mask(pieces, Pieces::White, true) | PseudoLegalMoveMaskGeneration::generate_pawn_right_captures_mask(pieces, Pieces::White, true);
    Bitboard black_captures = PseudoLegalMoveMaskGeneration::generate_pawn_left_captures_mask(pieces, Pieces::Black, true) | PseudoLegalMoveMaskGeneration::generate_pawn_right_captures_mask(pieces, Pieces::Black, true);

    connected_pawn_ctr = connected_pawn_ctr + BitboardOperations::count_1(white_captures & pieces.pieceBitboards[Pieces::White][Pieces::Pawn]);
    connected_pawn_ctr = connected_pawn_ctr - BitboardOperations::count_1(black_captures & pieces.pieceBitboards[Pieces::Black][Pieces::Pawn]);

    connected_pawn = connected_pawn + StaticEvaluator::PawnStructure::ConnectedPawn * connected_pawn_ctr;

    return connected_pawn;
}
int32_t StaticEvaluator::pawn_structure_pawn_promotion(Pieces pieces) {
    int32_t pawn_promotion = 0;

    Bitboard white_pawns = pieces.pieceBitboards[Pieces::White][Pieces::Pawn];
    Bitboard black_pawns = pieces.pieceBitboards[Pieces::Black][Pieces::Pawn];

    uint8_t index;

    while (white_pawns) {
        index = BitboardOperations::bsf(white_pawns);
        BitboardOperations::set_0(white_pawns, index);

        if (PassedPawnMasks::WhitePassedPawnMasks[index] & pieces.pieceBitboards[Pieces::Black][Pieces::Pawn]) pawn_promotion = pawn_promotion + StaticEvaluator::PawnStructure::DefaultPawnPromotion[index / 8];
        else pawn_promotion = pawn_promotion + StaticEvaluator::PawnStructure::PassedPawnPromotion[index / 8];
    }
    while (black_pawns) {
        index = BitboardOperations::bsf(black_pawns);
        BitboardOperations::set_0(black_pawns, index);

        if (PassedPawnMasks::BlackPassedPawnMasks[index] & pieces.pieceBitboards[Pieces::White][Pieces::Pawn]) pawn_promotion = pawn_promotion - StaticEvaluator::PawnStructure::DefaultPawnPromotion[7 - index / 8];
        else pawn_promotion = pawn_promotion - StaticEvaluator::PawnStructure::PassedPawnPromotion[7 - index / 8];
    }

    return pawn_promotion;
}
int32_t StaticEvaluator::king_safety_crashed_castling(bool w_l_castling, bool w_s_castling, bool b_l_castling, bool b_s_castling, bool white_castling_happened, bool black_castling_happened) {
    int32_t crashed_castling = 0;

    if (!white_castling_happened) {
        if (!w_l_castling) crashed_castling = crashed_castling + StaticEvaluator::KingSafety::CrashedCastling;
        if (!w_s_castling) crashed_castling = crashed_castling + StaticEvaluator::KingSafety::CrashedCastling;
    }

    if (!black_castling_happened) {
        if (!b_l_castling) crashed_castling = crashed_castling - StaticEvaluator::KingSafety::CrashedCastling;
        if (!b_s_castling) crashed_castling = crashed_castling - StaticEvaluator::KingSafety::CrashedCastling;
    }

    return crashed_castling;
}
int32_t StaticEvaluator::king_safety_pawn_shield(Pieces pieces, bool white_castling_happened, bool black_castling_happened) {
    int32_t pawn_shield = 0;

    int32_t pawn_shield_ctr = 0;

    if (white_castling_happened) {
        Bitboard white_pawns = pieces.pieceBitboards[Pieces::White][Pieces::Pawn];
        Bitboard white_pawn_shield = PawnShieldMasks::WhitePawnShieldMasks[BitboardOperations::bsf(pieces.pieceBitboards[Pieces::White][Pieces::King])];
        pawn_shield_ctr = pawn_shield_ctr + BitboardOperations::count_1(white_pawns & white_pawn_shield);
    }

    if (black_castling_happened) {
        Bitboard black_pawns = pieces.pieceBitboards[Pieces::Black][Pieces::Pawn];
        Bitboard black_pawn_shield = PawnShieldMasks::BlackPawnShieldMasks[BitboardOperations::bsf(pieces.pieceBitboards[Pieces::Black][Pieces::King])];
        pawn_shield_ctr = pawn_shield_ctr - BitboardOperations::count_1(black_pawns & black_pawn_shield);
    }

    pawn_shield = pawn_shield + StaticEvaluator::KingSafety::PawnShield * pawn_shield_ctr;

    return pawn_shield;
}
int32_t StaticEvaluator::two_bishops(Pieces pieces) {
    int32_t two_bishops = 0;

    if (BitboardOperations::count_1(pieces.pieceBitboards[Pieces::White][Pieces::Bishop]) >= 2) two_bishops = two_bishops + StaticEvaluator::TwoBishops;
    if (BitboardOperations::count_1(pieces.pieceBitboards[Pieces::Black][Pieces::Bishop]) >= 2) two_bishops = two_bishops - StaticEvaluator::TwoBishops;

    return two_bishops;
}
int32_t StaticEvaluator::endgame(Pieces pieces, bool white_leading) {
    int32_t endgame = 0;

    if (BitboardOperations::count_1(pieces.all) > StaticEvaluator::Endgame::MaximumPiecesForEndgame) return endgame;

    uint8_t attacker_side;
    uint8_t defender_side;

    if (white_leading) {
        attacker_side = Pieces::White;
        defender_side = Pieces::Black;
    }
    else {
        attacker_side = Pieces::Black;
        defender_side = Pieces::White;
    }

    uint8_t attacker_king_p = BitboardOperations::bsf(pieces.pieceBitboards[attacker_side][Pieces::King]);
    uint8_t attacker_king_x = attacker_king_p % 8;
    uint8_t attacker_king_y = attacker_king_p / 8;

    uint8_t defender_king_p = BitboardOperations::bsf(pieces.pieceBitboards[defender_side][Pieces::King]);
    uint8_t defender_king_x = defender_king_p % 8;
    uint8_t defender_king_y = defender_king_p / 8;

    endgame = endgame + StaticEvaluator::Endgame::AttackerKingProximityToDefenderKing * (16 - std::abs(attacker_king_x - defender_king_x) - std::abs(attacker_king_y - defender_king_y));
    endgame = endgame + StaticEvaluator::Endgame::DistanceBetweenDefenderKingAndMiddle * (std::abs(defender_king_x - 3) + std::abs(defender_king_y - 4));

    if (!white_leading) endgame = -endgame;

    return endgame;
}


// int main(){

//     StaticEvaluator::evaluate(Pieces("r3k2r/pp4pp/8/8/8/2P5/PP4PP/R3K2R"), 1, 1, 1, 1, 0, 0, 1);
//     return 0;
// }