#include <array>
#include "../PositionRepresentation/Move.cpp"
#include "../PositionRepresentation/Pieces.cpp"

#pragma once


class MoveList {
public:
    MoveList();

    Move &operator[](uint8_t index){
    return this->moves[index];
    };
    Move operator[](uint8_t index) const{
    return this->moves[index];
    };
    void push_back(Move move1){
        this->moves[this->msize] = move1;
        this->msize = this->msize + 1;
    };
    uint8_t size() const;
private:
    std::array<Move, 218> moves{};
    uint8_t msize;
};
MoveList::MoveList() {
    this->msize = 0;
}

uint8_t MoveList::size() const {
    return this->msize;
}
