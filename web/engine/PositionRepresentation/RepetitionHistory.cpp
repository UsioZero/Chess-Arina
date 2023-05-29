#include <vector>
#include "Zobrist.cpp"


#pragma once


class RepetitionHistory {
public:
    RepetitionHistory();

    void add_position(ZobristHash hash);

    void clear();

    uint8_t get_repetition_number(ZobristHash hash);
private:
    std::vector<ZobristHash> hashes;
};
RepetitionHistory::RepetitionHistory() = default;
void RepetitionHistory::add_position(ZobristHash hash) {
    this->hashes.push_back(hash);
}
void RepetitionHistory::clear() {
    this->hashes.clear();
}
uint8_t RepetitionHistory::get_repetition_number(ZobristHash hash) {
    uint8_t ctr = 0;

    for (auto hash1 : this->hashes) if (hash == hash1) ctr = ctr + 1;

    return ctr;
}