#include <fstream>
#include <sstream>
#include <tuple>
#include "../MoveGeneration/LegalMoveGeneration.cpp"


#pragma once


class OpeningBook {
public:
    OpeningBook();
    OpeningBook(const std::string& path);

    std::tuple<Move, int32_t> try_to_find_move(const Position& position);
private:
    std::vector<std::vector<Move>> moves;
};


OpeningBook::OpeningBook() = default;
OpeningBook::OpeningBook(const std::string& path) {
    std::ifstream file(path);
    if (!file.is_open()) {
        std::cout << ANSI::Red << "Could not find the opening book." << ANSI::End << std::endl;
        std::exit(255);
    }

    std::string game;
    std::stringstream game_thread;

    std::string string_move;
    uint8_t from;
    uint8_t to;

    MoveList possible_moves;
    bool move_found;

    Position buff;

    while (std::getline(file, game)) {
        game_thread = std::stringstream(game);
        this->moves.resize(this->moves.size() + 1);

        buff = {"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", 255, true, true, true, true, 1};

        while (game_thread >> string_move and game_thread.good()) {
            from = (string_move[1] - '1') * 8 + string_move[0] - 'a';
            to = (string_move[3] - '1') * 8 + string_move[2] - 'a';

            possible_moves = LegalMoveGeneration::generate(buff, buff.move_ctr - std::floor(buff.move_ctr) > 1e-7);
            move_found = false;
            for (uint8_t i = 0; i < possible_moves.size(); i = i + 1) {
                if (possible_moves[i].from == from and possible_moves[i].to == to) {
                    this->moves.back().push_back(possible_moves[i]);
                    buff.move(possible_moves[i]);
                    move_found = true;
                    break;
                }
            }
            if (!move_found) {
                std::cout << ANSI::Red << "Error in the opening book." << ANSI::End << std::endl;
                std::exit(255);
            }
        }
    }

    file.close();
}
std::tuple<Move, int32_t> OpeningBook::try_to_find_move(const Position& position) {
    Position buff;

    std::vector<Move> possible_moves;
    bool move_exist;

    for (int32_t game = 0; game < this->moves.size(); game = game + 1) {
        buff = {"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", 255, true, true, true, true, 1};

        if (buff.pieces == position.pieces) {
            move_exist = false;
            for (auto added_move : possible_moves) {
                if (added_move == this->moves[game][0]) {
                    move_exist = true;
                    break;
                }
            }

            if (!move_exist) possible_moves.push_back(this->moves[game][0]);
            continue;
        }

        for (int32_t move = 0; move < this->moves[game].size() - 1; move = move + 1) {
            buff.move(this->moves[game][move]);

            if (buff.pieces == position.pieces) {
                move_exist = false;
                for (auto added_move : possible_moves) {
                    if (added_move == this->moves[game][move + 1]) {
                        move_exist = true;
                        break;
                    }
                }

                if (!move_exist) possible_moves.push_back(this->moves[game][move + 1]);
            }
        }
    }

    if (possible_moves.empty()) {
        return std::make_tuple(Move(), 0);
    }

    return std::make_tuple(possible_moves[time(nullptr) % possible_moves.size()], possible_moves.size());
}