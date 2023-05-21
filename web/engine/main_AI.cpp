#include "PositionRepresentation/Position.cpp"
#include "PositionRepresentation/Move.cpp"
#include "MoveGeneration/MoveList.cpp"
#include "MoveGeneration/LegalMoveGeneration.cpp"
#include "AI/AI.cpp"

int main(int argc, const char *argv[])
{

    std::string get_short_fen;
    int en_passant;
    bool w_l_castling;
    bool w_s_castling;
    bool b_l_castling;
    bool b_s_castling;
    float move_ctr;
    int to;
    int from;
    int at;
    int as;
    int dt;
    int ds;
    int flag;

    get_short_fen = std::string(argv[1]);
    en_passant = atoi(argv[2]);
    // std::cout << unsigned(std::uint8_t(en_passant));
    w_l_castling = argv[3];
    w_s_castling = argv[4];
    b_l_castling = argv[5];
    b_s_castling = argv[6];
    move_ctr = atof(argv[7]);
    from = atoi(argv[8]);
    to = atoi(argv[9]);
    at = atoi(argv[10]);
    as = atoi(argv[11]);
    dt = atoi(argv[12]);
    ds = atoi(argv[13]);
    flag = atoi(argv[14]);
    const std::string short_fen = get_short_fen;
    Position position(short_fen, unsigned(std::uint8_t(en_passant)), w_l_castling, w_s_castling, b_l_castling, b_s_castling, move_ctr);

    bool side;
    int intPart = static_cast<int>(move_ctr);
    if (std::abs(move_ctr - intPart) < 0.0001)
    {

        side = 0;
    }
    else
    {
        side = 1;
    }
    Move cm(from, to, as, at, dt, ds, flag);
    position.move(cm);
    side = !side;
    // std::cout << position;
    //  std::cout<<short_fen;
    //  std::cout<<en_passant;
    //  std::cout<<w_l_castling;
    //  std::cout<<w_s_castling;
    //  std::cout<<b_l_castling;
    //  std::cout<<b_s_castling;
    //  std::cout<<move_ctr;

    AI ai("opening_book.txt");
    Move bm = ai.best_move(position, side, 1000, 3500);
    position.move(bm);
    side = !side;
    std::cout << position.pieces.getShortFEN() << '\n';
    std::cout << unsigned(position.en_passant) << '\n';
    std::cout << position.w_l_castling << '\n';
    std::cout << position.w_s_castling << '\n';
    std::cout << position.b_l_castling << '\n';
    std::cout << position.b_s_castling << '\n';
    std::cout << position.move_ctr << '\n';
    MoveList legalmoves = LegalMoveGeneration::generate(position, side, false);
    for (int i = 0; i < legalmoves.size(); i++)
    {
        std::cout << unsigned(legalmoves[i].from) << " " << unsigned(legalmoves[i].to) << " " << unsigned(legalmoves[i].flag) << '\n';
    }

    return 0;
}