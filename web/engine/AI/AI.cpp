#include <chrono>
#include <future>
#include <unistd.h>
#include <iomanip>
#include "../MoveGeneration/LegalMoveGeneration.cpp"
#include "MoveSorter.cpp"
#include "TranspositionTable.cpp"
#include "OpeningBook.cpp"


#pragma once


class AI {
public:
    AI();
    AI(const std::string& opening_book_path);

    Move best_move(const Position& position, uint8_t side, int32_t min_ms, int32_t max_ms);
private:
    OpeningBook opening_book;

    static std::tuple<int32_t, Move> _best_move(const Position& position, uint8_t side, int32_t depth, TranspositionTable &tt);

    static std::tuple<int32_t, Move> alpha_beta_min(Position position, int32_t alpha, int32_t beta, int32_t depth_left, int32_t depth_current, TranspositionTable &tt);
    static std::tuple<int32_t, Move> alpha_beta_max(Position position, int32_t alpha, int32_t beta, int32_t depth_left, int32_t depth_current, TranspositionTable &tt);

    static int32_t alpha_beta_min_only_captures(const Position& position, int32_t alpha, int32_t beta, int32_t depth_current);
    static int32_t alpha_beta_max_only_captures(const Position& position, int32_t alpha, int32_t beta, int32_t depth_current);

    struct Infinity {
        static constexpr int32_t Negative = -1e+9;
        static constexpr int32_t Positive = 1e+9;
    };
};


#define nsecs std::chrono::high_resolution_clock::now().time_since_epoch().count()


static std::atomic<bool> stop_search;


static int64_t evaluated;
static int32_t maximal_depth;
static int32_t tt_cutoffs;


AI::AI() = default;
AI::AI(const std::string& opening_book_path) {
    this->opening_book = {opening_book_path};
}
Move AI::best_move(const Position& position, uint8_t side, int32_t min_ms, int32_t max_ms) {
    std::cout << std::endl;
    StaticEvaluator::evaluate(position.pieces, position.w_l_castling, position.w_s_castling, position.b_l_castling, position.b_s_castling, position.white_castling_happened, position.black_castling_happened, true);

    int64_t time_start = nsecs;
    stop_search = false;
    TranspositionTable tt;

    std::tuple<Move, int32_t> opening_book_result = this->opening_book.try_to_find_move(position);
    std::cout << ANSI::Green << "Number of available moves in the opening book: " << std::get<1>(opening_book_result) << "." << ANSI::End << std::endl;
    if (std::get<1>(opening_book_result)) {
        usleep(std::max((int64_t)0, (min_ms - (nsecs - time_start) / (int64_t)1e+6) * (int64_t)1e+3));
        return std::get<0>(opening_book_result);
    }

    std::cout << ANSI::Green << "Search started." << std::endl;

    int32_t best_move_evaluation;
    Move best_move;
    std::future<std::tuple<int32_t, Move>> best_move_thread;

    bool update_best_move;

    for (int32_t i = 1; i < 1e+3; i = i + 1) {
        evaluated = 0;
        maximal_depth = 0;
        tt_cutoffs = 0;

        best_move_thread = std::async(AI::_best_move, position, side, i, std::ref(tt));

        update_best_move = true;
        while (best_move_thread.wait_for(std::chrono::seconds(0)) != std::future_status::ready) {
            if ((nsecs - time_start) / (int32_t)1e+6 >= max_ms) {
                update_best_move = false;
                break;
            }
            usleep(20000);
        }

        if (update_best_move || i == 1) std::tie(best_move_evaluation, best_move) = best_move_thread.get();
        else {
            stop_search = true;
            break;
        }

        std::cout << "Base depth: " << std::setw(4) << i << ". Maximal depth: " << std::setw(4) << maximal_depth << ". Evaluation: " << std::setw(6) << (float)best_move_evaluation / 100.0f << " pawns. Evaluated (this iteration): " << std::setw(10) << evaluated << ". TT cutoffs (this iteration): " << std::setw(10) << tt_cutoffs << ". Time (full search): " << std::setw(10) << (nsecs - time_start) / (int32_t)1e+6 << " ms." << std::endl;

        if (best_move_evaluation > AI::Infinity::Positive - 2000 or best_move_evaluation < AI::Infinity::Negative + 2000) break;
    }

    usleep(std::max((int64_t)0, (min_ms - (nsecs - time_start) / (int64_t)1e+6) * (int64_t)1e+3));

    std::cout << "Search finished." << std::endl << ANSI::End;

    return best_move;
}
std::tuple<int32_t, Move> AI::_best_move(const Position& position, uint8_t side, int32_t depth, TranspositionTable &tt) {
    if (side == Pieces::White) return AI::alpha_beta_max(position, AI::Infinity::Negative, AI::Infinity::Positive, depth, 0, tt);
    return AI::alpha_beta_min(position, AI::Infinity::Negative, AI::Infinity::Positive, depth, 0, tt);
}
std::tuple<int32_t, Move> AI::alpha_beta_min(Position position, int32_t alpha, int32_t beta, int32_t depth_left, int32_t depth_current, TranspositionTable &tt) {
    if (stop_search) return std::make_tuple(0, Move());
    if (depth_current > maximal_depth) maximal_depth = depth_current;

    if (depth_left == 0) return std::make_tuple(AI::alpha_beta_min_only_captures(position, alpha, beta, depth_current), Move());

    if (position.fifty_moves_ctr >= 50 or position.repetition_history.get_repetition_number(position.hash) >= 3) return std::make_tuple(0, Move());

    MoveList moves = LegalMoveGeneration::generate(position, Pieces::Black);
    moves = MoveSorter::sort(position.pieces, moves);
    Move move;
    Move best_move;
    uint8_t best_move_index;

    bool in_check = PseudoLegalMoveMaskGeneration::in_danger(position.pieces, BitboardOperations::bsf(position.pieces.pieceBitboards[Pieces::Black][Pieces::King]), Pieces::Black);

    if (moves.size() == 0) {
        if (in_check) return std::make_tuple(AI::Infinity::Positive - depth_current, Move());
        return std::make_tuple(0, Move());
    }

    int32_t evaluation;

    Position copy;

    uint8_t tt_result = tt.try_to_find_best_move_index(position.hash);

    for (uint8_t i = 0; i < moves.size(); i = i + 1) {
        if (tt_result >= moves.size()) move = moves[i];
        else {
            if (i == 0) move = moves[tt_result];
            else {
                if (i == tt_result) move = moves[0];
                else move = moves[i];
            }
        }

        copy = position;
        copy.move(move);
        evaluation = std::get<0>(AI::alpha_beta_max(copy, alpha, beta, depth_left - !in_check, depth_current + 1, tt));

        if (evaluation <= alpha) {
            if (tt_result >= moves.size() or i != 0) tt.add_entry({position.hash, depth_left, best_move_index});
            else tt_cutoffs = tt_cutoffs + 1;
            return std::make_tuple(alpha, best_move);
        }
        if (evaluation < beta) {
            best_move = move;
            best_move_index = i;
            beta = evaluation;
        }
    }

    tt.add_entry({position.hash, depth_left, best_move_index});
    return std::make_tuple(beta, best_move);
}
std::tuple<int32_t, Move> AI::alpha_beta_max(Position position, int32_t alpha, int32_t beta, int32_t depth_left, int32_t depth_current, TranspositionTable &tt) {
    if (stop_search) return std::make_tuple(0, Move());
    if (depth_current > maximal_depth) maximal_depth = depth_current;

    if (depth_left == 0) return std::make_tuple(AI::alpha_beta_max_only_captures(position, alpha, beta, depth_current), Move());

    if (position.fifty_moves_ctr >= 50 or position.repetition_history.get_repetition_number(position.hash) >= 3) return std::make_tuple(0, Move());

    MoveList moves = LegalMoveGeneration::generate(position, Pieces::White);
    moves = MoveSorter::sort(position.pieces, moves);
    Move move;
    Move best_move;
    uint8_t best_move_index;

    bool in_check = PseudoLegalMoveMaskGeneration::in_danger(position.pieces, BitboardOperations::bsf(position.pieces.pieceBitboards[Pieces::White][Pieces::King]), Pieces::White);

    if (moves.size() == 0) {
        if (in_check) return std::make_tuple(AI::Infinity::Negative + depth_current, Move());
        return std::make_tuple(0, Move());
    }

    int32_t evaluation;

    Position copy;

    uint8_t tt_result = tt.try_to_find_best_move_index(position.hash);

    for (uint8_t i = 0; i < moves.size(); i = i + 1) {
        if (tt_result >= moves.size()) move = moves[i];
        else {
            if (i == 0) move = moves[tt_result];
            else {
                if (i == tt_result) move = moves[0];
                else move = moves[i];
            }
        }

        copy = position;
        copy.move(move);
        evaluation = std::get<0>(AI::alpha_beta_min(copy, alpha, beta, depth_left - !in_check, depth_current + 1, tt));

        if (evaluation >= beta) {
            if (tt_result >= moves.size() or i != 0) tt.add_entry({position.hash, depth_left, best_move_index});
            else tt_cutoffs = tt_cutoffs + 1;
            return std::make_tuple(beta, best_move);
        }
        if (evaluation > alpha) {
            best_move = move;
            best_move_index = i;
            alpha = evaluation;
        }
    }

    tt.add_entry({position.hash, depth_left, best_move_index});
    return std::make_tuple(alpha, best_move);
}
int32_t AI::alpha_beta_min_only_captures(const Position& position, int32_t alpha, int32_t beta, int32_t depth_current) {
    if (stop_search) return 0;
    if (depth_current > maximal_depth) maximal_depth = depth_current;

    int32_t evaluation = StaticEvaluator::evaluate(position.pieces, position.w_l_castling, position.w_s_castling, position.b_l_castling, position.b_s_castling, position.white_castling_happened, position.black_castling_happened);
    evaluated = evaluated + 1;

    if (evaluation <= alpha) return alpha;
    if (evaluation < beta) beta = evaluation;

    MoveList moves = LegalMoveGeneration::generate(position, Pieces::Black, true);
    moves = MoveSorter::sort(position.pieces, moves);
    Move move;

    Position copy;

    for (uint8_t i = 0; i < moves.size(); i = i + 1) {
        move = moves[i];

        copy = position;
        copy.move(move);
        evaluation = AI::alpha_beta_max_only_captures(copy, alpha, beta, depth_current + 1);

        if (evaluation <= alpha) return alpha;
        if (evaluation < beta) beta = evaluation;
    }

    return beta;
}
int32_t AI::alpha_beta_max_only_captures(const Position& position, int32_t alpha, int32_t beta, int32_t depth_current) {
    if (stop_search) return 0;
    if (depth_current > maximal_depth) maximal_depth = depth_current;

    int32_t evaluation = StaticEvaluator::evaluate(position.pieces, position.w_l_castling, position.w_s_castling, position.b_l_castling, position.b_s_castling, position.white_castling_happened, position.black_castling_happened);
    evaluated = evaluated + 1;

    if (evaluation >= beta) return beta;
    if (evaluation > alpha) alpha = evaluation;

    MoveList moves = LegalMoveGeneration::generate(position, Pieces::White, true);
    moves = MoveSorter::sort(position.pieces, moves);
    Move move;

    Position copy;

    for (uint8_t i = 0; i < moves.size(); i = i + 1) {
        move = moves[i];

        copy = position;
        copy.move(move);
        evaluation = AI::alpha_beta_min_only_captures(copy, alpha, beta, depth_current + 1);

        if (evaluation >= beta) return beta;
        if (evaluation > alpha) alpha = evaluation;
    }

    return alpha;
}

// int main(){
//     AI ai("../opening_book.txt");
//     Move bm = ai.best_move(Position("rnbqkbnr/pppp1ppp/8/4p3/3P4/8/PPP1PPPP/RNBQKBNR",44,1,1,1,1,2), 0, 1000, 10000);
//     std::cout<<unsigned(bm.from)<<" "<<unsigned(bm.to)<<" "<<unsigned(bm.pieceType);

//     Move bm2 = ai.best_move(Position("rnbqkbnr/pppp1ppp/8/4P3/8/8/PPP1PPPP/RNBQKBNR",255,1,1,1,1,2.5), 1, 1000, 10000);
//     std::cout<<unsigned(bm2.from)<<" "<<unsigned(bm2.to)<<" "<<unsigned(bm2.pieceType);
//     return 0;
// }