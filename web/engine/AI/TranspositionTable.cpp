#include <set>
#include "Entry.cpp"


#pragma one


class TranspositionTable {
public:
    TranspositionTable();

    void add_entry(Entry entry);
    uint8_t try_to_find_best_move_index(ZobristHash hash);
private:
    std::set<Entry> set;
};

TranspositionTable::TranspositionTable() = default;
void TranspositionTable::add_entry(Entry entry) {
    auto hash_copy = this->set.find(entry);
    if (hash_copy == this->set.end() or hash_copy->depth < entry.depth) this->set.insert(entry);
}
uint8_t TranspositionTable::try_to_find_best_move_index(ZobristHash hash) {
    auto entry = this->set.find({hash, 0, 0});

    if (entry == this->set.end()) return 255;
    return entry->best_move_index;
}