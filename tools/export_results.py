#!/usr/bin/env python3
"""
학생 진단 결과 CSV 변환기 (Result JSON to CSV Exporter)
웹 브라우저에서 다운로드한 fact_checker_results_*.json 파일을 엑셀에서 바로 열 수 있는 CSV로 변환합니다.
"""

import json
import csv
import sys
import glob
import os

def convert_json_to_csv(json_path, output_csv_path=None):
    if not os.path.exists(json_path):
        print(f"❌ 파일을 찾을 수 없습니다: {json_path}")
        return

    if not output_csv_path:
        output_csv_path = os.path.splitext(json_path)[0] + ".csv"

    with open(json_path, 'r', encoding='utf-8') as f:
        records = json.load(f)

    if not records:
        print("⚠️ 변환할 진단 기록 데이터가 비어 있습니다.")
        return

    # CSV 컬럼 헤더 정의
    headers = [
        "기록ID", "진단일시", "학생닉네임", "학교명", "학년",
        "PISA문해력점수", "PISA등급", "PISA뱃지",
        "Big6종합평균", "1_과제정의", "2_탐색전략", "3_위치접근",
        "4_정보활용", "5_정보종합", "6_평가성찰",
        "최고강점영역", "도약보완영역"
    ]

    rows = []
    for r in records:
        student = r.get("student", {})
        pisa = r.get("pisa", {})
        big6 = r.get("big6", {})
        scores = big6.get("scores", {})

        row = [
            r.get("id", ""),
            r.get("dateFormatted", ""),
            student.get("nickname", ""),
            student.get("school", ""),
            student.get("grade", ""),
            pisa.get("score", 0),
            pisa.get("level", ""),
            pisa.get("badge", ""),
            big6.get("average", 0),
            scores.get("taskDefinition", 0),
            scores.get("seekingStrategies", 0),
            scores.get("locationAccess", 0),
            scores.get("useOfInformation", 0),
            scores.get("synthesis", 0),
            scores.get("evaluation", 0),
            big6.get("bestDomain", {}).get("name", ""),
            big6.get("weakestDomain", {}).get("name", "")
        ]
        rows.append(row)

    # UTF-8 with BOM for Korean Excel compatibility
    with open(output_csv_path, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

    print(f"✅ 변환 완료! 총 {len(rows)}건의 진단 기록이 저장되었습니다:")
    print(f"📄 CSV 파일 경로: {output_csv_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        target_file = sys.argv[1]
        convert_json_to_csv(target_file)
    else:
        # 최근 JSON 파일 자동 검색
        downloads = glob.glob("fact_checker_results_*.json") + glob.glob("../fact_checker_results_*.json")
        if downloads:
            latest = sorted(downloads)[-1]
            print(f"🔍 최근 진단 결과 파일 발견: {latest}")
            convert_json_to_csv(latest)
        else:
            print("사용법: python export_results.py <결과_JSON_파일경로>")
            print("예시: python export_results.py fact_checker_results_1710000000.json")
