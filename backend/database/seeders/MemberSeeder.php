<?php

namespace Database\Seeders;

use App\Models\Member;
use Illuminate\Database\Seeder;

class MemberSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            ['name' => 'Alice Engineer',  'email' => 'alice@forge.dev', 'role' => 'admin',  'avatar_url' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'],
            ['name' => 'Bob Designer',    'email' => 'bob@forge.dev',   'role' => 'member', 'avatar_url' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'],
            ['name' => 'Charlie Product', 'email' => 'charlie@forge.dev','role' => 'admin',  'avatar_url' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie'],
            ['name' => 'Diana Marketing', 'email' => 'diana@forge.dev', 'role' => 'member', 'avatar_url' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana'],
            ['name' => 'Evan DevOps',     'email' => 'evan@forge.dev',  'role' => 'member', 'avatar_url' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Evan'],
        ];

        foreach ($members as $member) {
            Member::create($member);
        }
    }
}
