from algopy import arc4, ARC4Contract, BoxMap, String


class PollData(arc4.Struct, frozen=False):
    id: arc4.UInt64
    question: arc4.String
    option_1: arc4.String
    option_2: arc4.String
    option_3: arc4.String
    option_4: arc4.String
    option_5: arc4.String
    option_1_votes: arc4.UInt64
    option_2_votes: arc4.UInt64
    option_3_votes: arc4.UInt64
    option_4_votes: arc4.UInt64
    option_5_votes: arc4.UInt64
    voters: arc4.DynamicArray[arc4.Address]


class PollManager(ARC4Contract):
    def __init__(self) -> None:
        self.box_map_struct = BoxMap(arc4.UInt64, PollData, key_prefix="polls")
        self.next_poll_id = arc4.UInt64(1)

    @arc4.abimethod()
    def hello(self, name: String) -> String:
        return "Hello, " + name

    @arc4.abimethod
    def create_poll(
        self,
        poll_data: PollData,
    ) -> None:
        poll_data.id = self.next_poll_id
        self.box_map_struct[self.next_poll_id] = poll_data.copy()
        self.next_poll_id = arc4.UInt64(self.next_poll_id.native + 1)

    @arc4.abimethod
    def vote_option_1(self, poll_id: arc4.UInt64, caller: arc4.Address) -> None:
        assert not self.did_vote(poll_id, caller), "Already voted"
        self.box_map_struct[poll_id].option_1_votes = arc4.UInt64(self.box_map_struct[poll_id].option_1_votes.native + 1)
        self.box_map_struct[poll_id].voters.append(caller)

    @arc4.abimethod
    def vote_option_2(self, poll_id: arc4.UInt64, caller: arc4.Address) -> None:
        assert not self.did_vote(poll_id, caller), "Already voted"
        self.box_map_struct[poll_id].option_2_votes = arc4.UInt64(self.box_map_struct[poll_id].option_2_votes.native + 1)
        self.box_map_struct[poll_id].voters.append(caller)

    @arc4.abimethod
    def vote_option_3(self, poll_id: arc4.UInt64, caller: arc4.Address) -> None:
        assert not self.did_vote(poll_id, caller), "Already voted"
        assert self.box_map_struct[poll_id].option_3 != "", "Option doesn't exist in this poll"
        self.box_map_struct[poll_id].option_3_votes = arc4.UInt64(self.box_map_struct[poll_id].option_3_votes.native + 1)
        self.box_map_struct[poll_id].voters.append(caller)

    @arc4.abimethod
    def vote_option_4(self, poll_id: arc4.UInt64, caller: arc4.Address) -> None:
        assert not self.did_vote(poll_id, caller), "Already voted"
        assert self.box_map_struct[poll_id].option_4 != "", "Option doesn't exist in this poll"
        self.box_map_struct[poll_id].option_4_votes = arc4.UInt64(self.box_map_struct[poll_id].option_4_votes.native + 1)
        self.box_map_struct[poll_id].voters.append(caller)

    @arc4.abimethod
    def vote_option_5(self, poll_id: arc4.UInt64, caller: arc4.Address) -> None:
        assert not self.did_vote(poll_id, caller), "Already voted"
        assert self.box_map_struct[poll_id].option_5 != "", "Option doesn't exist in this poll"
        self.box_map_struct[poll_id].option_5_votes = arc4.UInt64(self.box_map_struct[poll_id].option_5_votes.native + 1)
        self.box_map_struct[poll_id].voters.append(caller)

    @arc4.abimethod
    def did_vote(self, poll_id: arc4.UInt64, caller: arc4.Address) -> bool:
        found = False
        for voter in self.box_map_struct[poll_id].voters:
            if caller == voter:
                found = True
                break
        return found
