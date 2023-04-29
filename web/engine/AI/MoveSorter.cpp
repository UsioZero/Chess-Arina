#include "../MoveGeneration/MoveList.cpp"
#include "StaticEvaluation.cpp"

// #include "../MoveGeneration/LegalMoveGeneration.cpp"
// #include "../PositionRepresentation/Position.cpp"

#pragma once

class MoveSorter
{
public:
    static MoveList sort(Pieces pieces, MoveList moves);

private:
    static int32_t evaluate_move(Pieces pieces, Move move);
};

MoveList MoveSorter::sort(Pieces pieces, MoveList moves)
{
    for (uint8_t i = 0; i < moves.size() - 1; i = i + 1)
    {
        for (uint8_t j = 0; j < moves.size() - i - 1; j = j + 1)
        {
            if (MoveSorter::evaluate_move(pieces, moves[j]) < MoveSorter::evaluate_move(pieces, moves[j + 1]))
                std::swap(moves[j], moves[j + 1]);
        }
    }
    // for (int i=0;i<moves.size(); i++)
    // {
    //     std::cout<<evaluate_move(pieces, moves[i])<<" ";
    // }
    // std::cout<<'\n';
    return moves;
}
int32_t MoveSorter::evaluate_move(Pieces pieces, Move move)
{
    int32_t evaluation = 0;

    if (move.pieceType != Pieces::Pawn)
    {
        Bitboard opponent_pawn_attacks = PseudoLegalMoveMaskGeneration::generate_pawn_left_captures_mask(pieces, Pieces::inverse(move.pieceSide), true) | PseudoLegalMoveMaskGeneration::generate_pawn_right_captures_mask(pieces, Pieces::inverse(move.pieceSide), true);
        if (BitboardOperations::get_bit(opponent_pawn_attacks, move.to))
        {
            switch (move.pieceType)
            {
            case Pieces::Knight:
                evaluation = evaluation - StaticEvaluator::Material::Knight;
                break;
            case Pieces::Bishop:
                evaluation = evaluation - StaticEvaluator::Material::Bishop;
                break;
            case Pieces::Rook:
                evaluation = evaluation - StaticEvaluator::Material::Rook;
                break;
            case Pieces::Queen:
                evaluation = evaluation - StaticEvaluator::Material::Queen;
                break;
            }
        }
    }

    if (move.attackedPieceType != 255)
    {
        switch (move.attackedPieceType)
        {
        case Pieces::Pawn:
            evaluation = evaluation + 1000 * StaticEvaluator::Material::Pawn;
            break;
        case Pieces::Knight:
            evaluation = evaluation + 1000 * StaticEvaluator::Material::Knight;
            break;
        case Pieces::Bishop:
            evaluation = evaluation + 1000 * StaticEvaluator::Material::Bishop;
            break;
        case Pieces::Rook:
            evaluation = evaluation + 1000 * StaticEvaluator::Material::Rook;
            break;
        case Pieces::Queen:
            evaluation = evaluation + 1000 * StaticEvaluator::Material::Queen;
            break;
        }
        switch (move.pieceType)
        {
        case Pieces::Pawn:
            evaluation = evaluation - StaticEvaluator::Material::Pawn;
            break;
        case Pieces::Knight:
            evaluation = evaluation - StaticEvaluator::Material::Knight;
            break;
        case Pieces::Bishop:
            evaluation = evaluation - StaticEvaluator::Material::Bishop;
            break;
        case Pieces::Rook:
            evaluation = evaluation - StaticEvaluator::Material::Rook;
            break;
        case Pieces::Queen:
            evaluation = evaluation - StaticEvaluator::Material::Queen;
            break;
        }
    }

    return evaluation;
}

// int main()
// {
//     MoveList ml = MoveSorter::sort(Pieces("rnb0kbnr/ppp1pppp/3q4/3pP3/8/8/PPPP1PPP/RNBQKBNR"), LegalMoveGeneration::generate(Position("rnb0kbnr/ppp1pppp/3q4/3pP3/8/8/PPPP1PPP/RNBQKBNR", 255, 1, 1, 1, 1, 2), 0));
//     for (int i = 0; i < ml.size(); i = i + 1)
//     {
//         std::cout << unsigned(ml[i].from) << " " << unsigned(ml[i].to) << " " << unsigned(ml[i].pieceType) << ' ' << unsigned(ml[i].flag) << '\n';
//     }
//     return 0;
// }