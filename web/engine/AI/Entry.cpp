#include "../PositionRepresentation/Zobrist.cpp"


#pragma once


struct Entry {
    Entry();
    Entry(ZobristHash hash, int32_t depth, uint8_t best_move_index);

    friend bool operator <(Entry left, Entry right);

    ZobristHash hash;
    int32_t depth;
    uint8_t best_move_index;
};

Entry::Entry() = default;
Entry::Entry(ZobristHash hash, int32_t depth, uint8_t best_move_index) {
    this->hash = hash;
    this->depth = depth;
    this->best_move_index = best_move_index;
}
bool operator <(Entry left, Entry right) {
    return (left.hash < right.hash);
}