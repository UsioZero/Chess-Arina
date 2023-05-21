#include <ostream>
#include <cctype>
#include "Bitboard.cpp"

#pragma once

struct Pieces
{
    Pieces();
    Pieces(const std::string &short_fen);

    friend std::ostream &operator<<(std::ostream &ostream, Pieces pieces);
    friend bool operator==(Pieces left, Pieces right);

    void update_bitboards();
    static uint8_t inverse(uint8_t side);
    char getPieceSymbol(int rank, int file);
    std::string getShortFEN();
    

    std::array<std::array<Bitboard, 6>, 2> pieceBitboards{};
    std::array<Bitboard, 2> sideBitboards{};
    std::array<Bitboard, 2> inversionSideBitboards{};
    Bitboard all;
    Bitboard empty;

    static constexpr uint8_t Pawn = 0;
    static constexpr uint8_t Knight = 1;
    static constexpr uint8_t Bishop = 2;
    static constexpr uint8_t Rook = 3;
    static constexpr uint8_t Queen = 4;
    static constexpr uint8_t King = 5;

    static constexpr uint8_t White = 0;
    static constexpr uint8_t Black = 1;
};
Pieces::Pieces() = default;
Pieces::Pieces(const std::string &short_fen)
{
    uint8_t x = 0;
    uint8_t y = 7;

    uint8_t side;

    for (auto buff : short_fen)
    {
        if (buff == '/')
        {
            x = 0;
            y = y - 1;
        }
        else if (std::isdigit(buff))
        {
            x = x + buff - '0';
        }
        else
        {
            if (std::isupper(buff))
            {
                buff = std::tolower(buff);
                side = Pieces::White;
            }
            else
                side = Pieces::Black;

            switch (buff)
            {
            case 'p':
                BitboardOperations::set_1(this->pieceBitboards[side][Pieces::Pawn], y * 8 + x);
                break;
            case 'n':
                BitboardOperations::set_1(this->pieceBitboards[side][Pieces::Knight], y * 8 + x);
                break;
            case 'b':
                BitboardOperations::set_1(this->pieceBitboards[side][Pieces::Bishop], y * 8 + x);
                break;
            case 'r':
                BitboardOperations::set_1(this->pieceBitboards[side][Pieces::Rook], y * 8 + x);
                break;
            case 'q':
                BitboardOperations::set_1(this->pieceBitboards[side][Pieces::Queen], y * 8 + x);
                break;
            case 'k':
                BitboardOperations::set_1(this->pieceBitboards[side][Pieces::King], y * 8 + x);
                break;
            }

            x = x + 1;
        }
    }

    this->update_bitboards();
}
std::ostream &operator<<(std::ostream &ostream, Pieces pieces)
{
    ostream << ANSI::Green;

    for (int8_t y = 7; y >= 0; y = y - 1)
    {
        for (uint8_t x = 0; x < 8; x = x + 1)
        {
            ostream << "|  ";

            if (BitboardOperations::get_bit(pieces.pieceBitboards[Pieces::White][Pieces::Pawn], y * 8 + x))
                ostream << "P";
            else if (BitboardOperations::get_bit(pieces.pieceBitboards[Pieces::White][Pieces::Knight], y * 8 + x))
                ostream << "N";
            else if (BitboardOperations::get_bit(pieces.pieceBitboards[Pieces::White][Pieces::Bishop], y * 8 + x))
                ostream << "B";
            else if (BitboardOperations::get_bit(pieces.pieceBitboards[Pieces::White][Pieces::Rook], y * 8 + x))
                ostream << "R";
            else if (BitboardOperations::get_bit(pieces.pieceBitboards[Pieces::White][Pieces::Queen], y * 8 + x))
                ostream << "Q";
            else if (BitboardOperations::get_bit(pieces.pieceBitboards[Pieces::White][Pieces::King], y * 8 + x))
                ostream << "K";

            else if (BitboardOperations::get_bit(pieces.pieceBitboards[Pieces::Black][Pieces::Pawn], y * 8 + x))
                ostream << "p";
            else if (BitboardOperations::get_bit(pieces.pieceBitboards[Pieces::Black][Pieces::Knight], y * 8 + x))
                ostream << "n";
            else if (BitboardOperations::get_bit(pieces.pieceBitboards[Pieces::Black][Pieces::Bishop], y * 8 + x))
                ostream << "b";
            else if (BitboardOperations::get_bit(pieces.pieceBitboards[Pieces::Black][Pieces::Rook], y * 8 + x))
                ostream << "r";
            else if (BitboardOperations::get_bit(pieces.pieceBitboards[Pieces::Black][Pieces::Queen], y * 8 + x))
                ostream << "q";
            else if (BitboardOperations::get_bit(pieces.pieceBitboards[Pieces::Black][Pieces::King], y * 8 + x))
                ostream << "k";

            else
                ostream << " ";

            ostream << "  ";
        }
        ostream << "|\n";
    }

    ostream << ANSI::End;

    return ostream;
}
bool operator==(Pieces left, Pieces right)
{
    for (uint8_t i = 0; i < 2; i = i + 1)
    {
        for (uint8_t j = 0; j < 6; j = j + 1)
        {
            if (left.pieceBitboards[i][j] != right.pieceBitboards[i][j])
                return false;
        }
    }

    return true;
}
void Pieces::update_bitboards()
{
    this->sideBitboards[Pieces::White] = this->pieceBitboards[Pieces::White][Pieces::Pawn] |
                                         this->pieceBitboards[Pieces::White][Pieces::Knight] |
                                         this->pieceBitboards[Pieces::White][Pieces::Bishop] |
                                         this->pieceBitboards[Pieces::White][Pieces::Rook] |
                                         this->pieceBitboards[Pieces::White][Pieces::Queen] |
                                         this->pieceBitboards[Pieces::White][Pieces::King];

    this->sideBitboards[Pieces::Black] = this->pieceBitboards[Pieces::Black][Pieces::Pawn] |
                                         this->pieceBitboards[Pieces::Black][Pieces::Knight] |
                                         this->pieceBitboards[Pieces::Black][Pieces::Bishop] |
                                         this->pieceBitboards[Pieces::Black][Pieces::Rook] |
                                         this->pieceBitboards[Pieces::Black][Pieces::Queen] |
                                         this->pieceBitboards[Pieces::Black][Pieces::King];

    this->inversionSideBitboards[Pieces::White] = ~this->sideBitboards[Pieces::White];
    this->inversionSideBitboards[Pieces::Black] = ~this->sideBitboards[Pieces::Black];

    this->all = this->sideBitboards[Pieces::White] | this->sideBitboards[Pieces::Black];
    this->empty = ~this->all;
}
uint8_t Pieces::inverse(uint8_t side)
{
    return !side;
}
char Pieces::getPieceSymbol(int rank, int file)
{
    for (int color = Pieces::White; color <= Pieces::Black; color++)
    {
        for (int piece = Pieces::Pawn; piece <= Pieces::King; piece++)
        {
            if (this->pieceBitboards[color][piece] & (1ULL << (rank * 8 + file)))
            {
                switch (piece)
                {
                case Pieces::Pawn:
                    return (color == Pieces::White) ? 'P' : 'p';
                case Pieces::Knight:
                    return (color == Pieces::White) ? 'N' : 'n';
                case Pieces::Bishop:
                    return (color == Pieces::White) ? 'B' : 'b';
                case Pieces::Rook:
                    return (color == Pieces::White) ? 'R' : 'r';
                case Pieces::Queen:
                    return (color == Pieces::White) ? 'Q' : 'q';
                case Pieces::King:
                    return (color == Pieces::White) ? 'K' : 'k';
                }
            }
        }
    }

    return ' ';
}
std::string Pieces::getShortFEN()
{
    std::string fen = "";

    for (int i = 7; i >= 0; i--)
    {
        int emptySquares = 0;

        for (int j = 0; j < 8; j++)
        {
            bool empty = true;

            for (int color = Pieces::White; color <= Pieces::Black; color++)
            {
                for (int piece = Pieces::Pawn; piece <= Pieces::King; piece++)
                {
                    if (this->pieceBitboards[color][piece] & (1ULL << (i * 8 + j)))
                    {
                        empty = false;
                        break;
                    }
                }
            }

            if (empty)
            {
                emptySquares++;
            }
            else
            {
                if (emptySquares > 0)
                {
                    fen += std::to_string(emptySquares);
                    emptySquares = 0;
                }

                fen += getPieceSymbol(i, j);
            }
        }

        if (emptySquares > 0)
        {
            fen += std::to_string(emptySquares);
        }

        if (i > 0)
        {
            fen += "/";
        }
    }

    return fen;
}


