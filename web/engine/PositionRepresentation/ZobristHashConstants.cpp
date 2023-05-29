#include <iostream>
#include <cstdint>
#include <array>

namespace ZobristHashConstants {
    const uint64_t seed = 0x98f107; // Значення для seed
    const uint64_t multiply = 0x71abc9; // Значення для multiply
    const uint64_t summand = 0xff1b3f; // Значення для summand


    // Функція для генерації псевдовипадкових чисел з використанням seed, multiply та summand
    int generateRandomNumber(uint64_t previous) {
        return previous*multiply + summand;
    }

    static std::array<std::array<std::array<uint64_t, 6>, 2>, 64> calc_constants() {
        std::array<std::array<std::array<uint64_t, 6>, 2>, 64> constants{};

        uint64_t previous = seed;

        for (uint8_t square = 0; square < 64; square = square + 1) {
            for (uint8_t side = 0; side < 2; side = side + 1) {
                for (uint8_t type = 0; type < 6; type = type + 1) {
                    previous = ZobristHashConstants::generateRandomNumber(previous);
                    constants[square][side][type] = previous;
                }
            }
        }

        return constants;
    }
    const std::array<std::array<std::array<uint64_t, 6>, 2>, 64> Constants = calc_constants();
    const uint64_t BlackMove = ZobristHashConstants::generateRandomNumber(ZobristHashConstants::Constants[63][1][5]);
    const uint64_t EnPassant = ZobristHashConstants::generateRandomNumber(ZobristHashConstants::BlackMove);
    const uint64_t WhiteLongCastling = ZobristHashConstants::generateRandomNumber(ZobristHashConstants::EnPassant);
    const uint64_t WhiteShortCastling = ZobristHashConstants::generateRandomNumber(ZobristHashConstants::WhiteLongCastling);
    const uint64_t BlackLongCastling = ZobristHashConstants::generateRandomNumber(ZobristHashConstants::WhiteShortCastling);
    const uint64_t BlackShortCastling = ZobristHashConstants::generateRandomNumber(ZobristHashConstants::BlackLongCastling);
}
